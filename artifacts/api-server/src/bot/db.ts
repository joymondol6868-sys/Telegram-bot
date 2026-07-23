import { eq, and, sql, count, desc, sum } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  usersTable, adsWatchedTable, withdrawalsTable,
  dailyTasksTable, referralsTable, activityLogTable,
  channelsTable, channelJoinsTable, botSettingsTable, userWarningsTable,
  DEFAULT_SETTINGS,
} from "@workspace/db";
import type { Lang } from "./languages.js";

export function todayStr(): string {
  return new Date().toISOString().split("T")[0]!;
}

function randomCode(len = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function randomToken(len = 12): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function seedSettings() {
  for (const [key, { value, description }] of Object.entries(DEFAULT_SETTINGS)) {
    if (key === "min_withdrawal") {
      await db.insert(botSettingsTable)
        .values({ key, value, description })
        .onConflictDoUpdate({
          target: botSettingsTable.key,
          set: { value, description, updatedAt: new Date() },
        });
    } else {
      await db.insert(botSettingsTable)
        .values({ key, value, description })
        .onConflictDoNothing();
    }
  }
}

export async function getSetting(key: string): Promise<string | null> {
  const rows = await db.select().from(botSettingsTable).where(eq(botSettingsTable.key, key)).limit(1);
  return rows[0]?.value ?? DEFAULT_SETTINGS[key]?.value ?? null;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(botSettingsTable);
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}

export async function updateSetting(key: string, value: string) {
  await db.insert(botSettingsTable)
    .values({ key, value })
    .onConflictDoUpdate({ target: botSettingsTable.key, set: { value, updatedAt: new Date() } });
}

export async function getNumSetting(key: string, fallback: number): Promise<number> {
  const v = await getSetting(key);
  const n = parseFloat(v ?? "");
  return isNaN(n) ? fallback : n;
}

// ─── Channels ────────────────────────────────────────────────────────────────

export async function getActiveChannels() {
  return db.select().from(channelsTable)
    .where(eq(channelsTable.isActive, true))
    .orderBy(channelsTable.sortOrder, channelsTable.id);
}

export async function getChannelJoin(userId: number, channelId: number) {
  const rows = await db.select().from(channelJoinsTable)
    .where(and(eq(channelJoinsTable.userId, userId), eq(channelJoinsTable.channelId, channelId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function recordChannelJoin(userId: number, channelId: number) {
  const existing = await getChannelJoin(userId, channelId);
  if (existing?.rewardPaid) return { alreadyClaimed: true };

  const channel = await db.select().from(channelsTable).where(eq(channelsTable.id, channelId)).limit(1);
  if (!channel[0]) return { alreadyClaimed: true };

  const reward = Number(channel[0].reward);

  if (!existing) {
    await db.insert(channelJoinsTable).values({ userId, channelId, rewardPaid: true });
  } else {
    await db.update(channelJoinsTable).set({ rewardPaid: true }).where(eq(channelJoinsTable.id, existing.id));
  }

  // Credit reward
  await db.update(usersTable)
    .set({ balance: sql`balance + ${reward}`, totalEarned: sql`total_earned + ${reward}` })
    .where(eq(usersTable.id, userId));

  // Mark daily task channel done
  const today = todayStr();
  const task = await db.select().from(dailyTasksTable)
    .where(and(eq(dailyTasksTable.userId, userId), eq(dailyTasksTable.taskDate, today))).limit(1);
  if (task[0] && !task[0].channelDone) {
    await db.update(dailyTasksTable).set({ channelDone: true }).where(eq(dailyTasksTable.id, task[0].id));
  }

  await logActivity("channel_join", `User joined channel #${channelId} +$${reward.toFixed(2)}`, userId);
  return { alreadyClaimed: false, reward };
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getOrCreateUser(
  telegramId: string,
  firstName: string,
  lastName: string | null,
  username: string | null,
  referralCode?: string,
) {
  const existing = await db.select().from(usersTable).where(eq(usersTable.telegramId, telegramId)).limit(1);
  if (existing[0]) {
    await db.update(usersTable)
      .set({ lastActive: new Date(), firstName, lastName: lastName ?? undefined, username: username ?? undefined })
      .where(eq(usersTable.telegramId, telegramId));
    return existing[0];
  }

  // Find referrer
  let referrerId: number | undefined;
  if (referralCode) {
    const referrer = await db.select().from(usersTable).where(eq(usersTable.referralCode, referralCode)).limit(1);
    if (referrer[0] && !referrer[0].isBanned) referrerId = referrer[0].id;
  }

  // Unique referral code
  let code = randomCode();
  for (let i = 0; i < 10; i++) {
    const exists = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.referralCode, code)).limit(1);
    if (!exists[0]) break;
    code = randomCode();
  }

  const [newUser] = await db.insert(usersTable).values({
    telegramId,
    firstName,
    lastName: lastName ?? undefined,
    username: username ?? undefined,
    referralCode: code,
    referredBy: referrerId,
    language: "en",
  }).returning();

  if (!newUser) throw new Error("Failed to create user");

  // Referral bonus
  if (referrerId) {
    const refReward = await getNumSetting("referral_reward", 0.05);
    await db.update(usersTable)
      .set({ balance: sql`balance + ${refReward}`, totalEarned: sql`total_earned + ${refReward}` })
      .where(eq(usersTable.id, referrerId));
    await db.insert(referralsTable).values({ referrerId, referredId: newUser.id, amount: String(refReward) });

    // Referrer daily task
    const today = todayStr();
    const task = await db.select().from(dailyTasksTable)
      .where(and(eq(dailyTasksTable.userId, referrerId), eq(dailyTasksTable.taskDate, today))).limit(1);
    if (task[0] && !task[0].referralDone) {
      await db.update(dailyTasksTable).set({ referralDone: true }).where(eq(dailyTasksTable.id, task[0].id));
    }
    await logActivity("referral", `New referral +$${refReward.toFixed(2)} for user #${referrerId}`, referrerId);
  }

  await logActivity("join", `New user joined: ${firstName}`, newUser.id);
  return newUser;
}

export async function getUserByTelegramId(telegramId: string) {
  const users = await db.select().from(usersTable).where(eq(usersTable.telegramId, telegramId)).limit(1);
  return users[0] ?? null;
}

export async function setUserLanguage(telegramId: string, lang: Lang) {
  await db.update(usersTable).set({ language: lang }).where(eq(usersTable.telegramId, telegramId));
}

export async function saveUserPanelMsg(telegramId: string, msgId: number | undefined) {
  await db.update(usersTable)
    .set({ lastPanelMsgId: msgId ?? null })
    .where(eq(usersTable.telegramId, telegramId));
}

export async function updateUserWallet(telegramId: string, method: string, address: string) {
  await db.update(usersTable)
    .set({ walletMethod: method, walletAddress: address })
    .where(eq(usersTable.telegramId, telegramId));
  await logActivity("wallet_update", `Wallet updated: ${method}`, undefined);
}

export async function updateUserName(telegramId: string, name: string) {
  await db.update(usersTable)
    .set({ firstName: name })
    .where(eq(usersTable.telegramId, telegramId));
}

// ─── Warnings ─────────────────────────────────────────────────────────────────

export async function getWarningCount(userId: number): Promise<number> {
  const [row] = await db.select({ cnt: count() }).from(userWarningsTable).where(eq(userWarningsTable.userId, userId));
  return row?.cnt ?? 0;
}

export async function issueWarning(userId: number, reason: string): Promise<{ banned: boolean; warningCount: number }> {
  await db.insert(userWarningsTable).values({ userId, reason, issuedBy: "system" });
  const warnCount = await getWarningCount(userId);
  const warnLimit = await getNumSetting("warn_limit", 3);

  if (warnCount >= warnLimit) {
    await db.update(usersTable).set({ isBanned: true }).where(eq(usersTable.id, userId));
    await logActivity("ban", `User auto-banned after ${warnCount} warnings`, userId);
    return { banned: true, warningCount: warnCount };
  }

  await logActivity("warning", `Warning issued: ${reason} (${warnCount}/${warnLimit})`, userId);
  return { banned: false, warningCount: warnCount };
}

// ─── Ads ──────────────────────────────────────────────────────────────────────

export async function getTodayAds(userId: number) {
  const today = todayStr();
  const rows = await db.select().from(adsWatchedTable)
    .where(and(eq(adsWatchedTable.userId, userId), eq(adsWatchedTable.watchDate, today)))
    .limit(1);
  return rows[0] ?? null;
}

export async function startAdWatch(userId: number): Promise<{ ok: boolean; token?: string; alreadyPending?: boolean; limitReached?: boolean }> {
  const today = todayStr();
  const maxAds = await getNumSetting("max_ads_per_day", 10);
  const row = await getTodayAds(userId);

  if (row && Number(row.count) >= maxAds) return { ok: false, limitReached: true };
  if (row?.pendingAdStart) return { ok: false, alreadyPending: true };

  const token = randomToken();

  if (!row) {
    await db.insert(adsWatchedTable).values({
      userId, watchDate: today, count: 0, todayEarned: "0",
      pendingAdStart: new Date(), pendingAdToken: token,
    });
  } else {
    await db.update(adsWatchedTable)
      .set({ pendingAdStart: new Date(), pendingAdToken: token })
      .where(eq(adsWatchedTable.id, row.id));
  }

  return { ok: true, token };
}

export async function completeAdWatch(userId: number, token: string): Promise<{ ok: boolean; cheated?: boolean; balance?: string; watched?: number; banned?: boolean }> {
  const today = todayStr();
  const row = await getTodayAds(userId);

  if (!row || !row.pendingAdStart || !row.pendingAdToken) {
    return { ok: false, cheated: true };
  }

  // Token must match
  if (row.pendingAdToken !== token) {
    await db.update(adsWatchedTable).set({ pendingAdStart: null, pendingAdToken: null }).where(eq(adsWatchedTable.id, row.id));
    return { ok: false, cheated: true };
  }

  const minSeconds = await getNumSetting("ad_min_seconds", 10);
  const elapsed = (Date.now() - new Date(row.pendingAdStart).getTime()) / 1000;
  if (elapsed < minSeconds) {
    await db.update(adsWatchedTable).set({ pendingAdStart: null, pendingAdToken: null }).where(eq(adsWatchedTable.id, row.id));

    // Issue warning if enabled
    const doWarn = await getSetting("cheat_warn");
    if (doWarn === "1") {
      const result = await issueWarning(userId, `Ad completed too fast (${elapsed.toFixed(1)}s < ${minSeconds}s)`);
      if (result.banned) return { ok: false, cheated: true, banned: true };
    }
    return { ok: false, cheated: true };
  }

  const maxAds = await getNumSetting("max_ads_per_day", 10);
  if (Number(row.count) >= maxAds) {
    await db.update(adsWatchedTable).set({ pendingAdStart: null, pendingAdToken: null }).where(eq(adsWatchedTable.id, row.id));
    return { ok: false };
  }

  const adEarn = await getNumSetting("ad_reward", 0.01);
  const newCount = Number(row.count) + 1;
  const newEarned = Number(row.todayEarned) + adEarn;

  await db.update(adsWatchedTable)
    .set({ count: newCount, todayEarned: String(newEarned), pendingAdStart: null, pendingAdToken: null, lastWatchedAt: new Date() })
    .where(eq(adsWatchedTable.id, row.id));

  await db.update(usersTable)
    .set({ balance: sql`balance + ${adEarn}`, totalEarned: sql`total_earned + ${adEarn}` })
    .where(eq(usersTable.id, userId));

  // Check ads task threshold
  const adsThreshold = await getNumSetting("ads_task_threshold", 5);
  if (newCount >= adsThreshold) {
    const taskRow = await db.select().from(dailyTasksTable)
      .where(and(eq(dailyTasksTable.userId, userId), eq(dailyTasksTable.taskDate, today))).limit(1);
    if (taskRow[0] && !taskRow[0].adsDone) {
      await db.update(dailyTasksTable).set({ adsDone: true }).where(eq(dailyTasksTable.id, taskRow[0].id));
    } else if (!taskRow[0]) {
      await db.insert(dailyTasksTable).values({ userId, taskDate: today, adsDone: true }).onConflictDoNothing();
    }
  }

  // Get updated balance
  const updUser = await db.select({ balance: usersTable.balance }).from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  return { ok: true, balance: updUser[0]?.balance ?? "0", watched: newCount };
}

export async function cancelAdWatch(userId: number) {
  const row = await getTodayAds(userId);
  if (row) {
    await db.update(adsWatchedTable).set({ pendingAdStart: null, pendingAdToken: null }).where(eq(adsWatchedTable.id, row.id));
  }
}

// ─── Daily Tasks ──────────────────────────────────────────────────────────────

export async function getOrCreateDailyTask(userId: number) {
  const today = todayStr();
  const existing = await db.select().from(dailyTasksTable)
    .where(and(eq(dailyTasksTable.userId, userId), eq(dailyTasksTable.taskDate, today))).limit(1);
  if (existing[0]) return existing[0];
  const [row] = await db.insert(dailyTasksTable).values({ userId, taskDate: today }).returning();
  return row!;
}

export async function markTaskShare(userId: number) {
  const task = await getOrCreateDailyTask(userId);
  if (!task.shareDone) {
    await db.update(dailyTasksTable).set({ shareDone: true }).where(eq(dailyTasksTable.id, task.id));
  }
}

export async function claimDailyBonus(userId: number): Promise<{ ok: boolean; reason?: string; balance?: string }> {
  const task = await db.select().from(dailyTasksTable)
    .where(and(eq(dailyTasksTable.userId, userId), eq(dailyTasksTable.taskDate, todayStr()))).limit(1);

  if (!task[0]) return { ok: false, reason: "notComplete" };
  if (task[0].bonusClaimed) return { ok: false, reason: "alreadyClaimed" };
  if (!task[0].shareDone || !task[0].channelDone || !task[0].adsDone || !task[0].referralDone) {
    return { ok: false, reason: "notComplete" };
  }

  const bonus = await getNumSetting("daily_bonus", 0.20);
  await db.update(dailyTasksTable).set({ bonusClaimed: true, claimedAt: new Date() }).where(eq(dailyTasksTable.id, task[0].id));
  await db.update(usersTable)
    .set({ balance: sql`balance + ${bonus}`, totalEarned: sql`total_earned + ${bonus}` })
    .where(eq(usersTable.id, userId));

  const updUser = await db.select({ balance: usersTable.balance }).from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  await logActivity("bonus", `Daily bonus $${bonus.toFixed(2)} claimed`, userId);
  return { ok: true, balance: updUser[0]?.balance ?? "0" };
}

// ─── Referrals ────────────────────────────────────────────────────────────────

export async function getReferralStats(userId: number) {
  const rows = await db.select().from(referralsTable).where(eq(referralsTable.referrerId, userId));
  const total = rows.reduce((s, r) => s + Number(r.amount), 0);
  return { count: rows.length, earned: total };
}

// ─── Withdrawals ──────────────────────────────────────────────────────────────

export async function getWalletStats(userId: number) {
  const [row] = await db.select({
    totalWithdrawn: sum(withdrawalsTable.amount),
  }).from(withdrawalsTable)
    .where(and(
      eq(withdrawalsTable.userId, userId),
      eq(withdrawalsTable.status, "approved"),
    ));

  return {
    totalWithdrawn: Number(row?.totalWithdrawn ?? 0),
  };
}

export async function getUserWithdrawalHistory(userId: number, limit = 10) {
  return db.select({
    id: withdrawalsTable.id,
    amount: withdrawalsTable.amount,
    method: withdrawalsTable.method,
    address: withdrawalsTable.address,
    status: withdrawalsTable.status,
    note: withdrawalsTable.note,
    createdAt: withdrawalsTable.createdAt,
  }).from(withdrawalsTable)
    .where(eq(withdrawalsTable.userId, userId))
    .orderBy(desc(withdrawalsTable.createdAt))
    .limit(limit);
}

export async function createWithdrawal(userId: number, amount: number, method: string, address: string) {
  const minWd = await getNumSetting("min_withdrawal", 0.50);
  if (amount < minWd) return { ok: false, reason: "tooLow" };

  const pending = await db.select().from(withdrawalsTable)
    .where(and(eq(withdrawalsTable.userId, userId), eq(withdrawalsTable.status, "pending"))).limit(1);
  if (pending[0]) return { ok: false, reason: "pending" };

  const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user[0] || Number(user[0].balance) < amount) return { ok: false, reason: "lowBalance" };

  await db.update(usersTable).set({ balance: sql`balance - ${amount}` }).where(eq(usersTable.id, userId));

  const [wd] = await db.insert(withdrawalsTable).values({
    userId, amount: String(amount), method, address, status: "pending",
  }).returning();

  await logActivity("withdraw", `Withdrawal $${amount} via ${method}`, userId);
  return { ok: true, wd };
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export async function logActivity(type: string, description: string, userId?: number) {
  await db.insert(activityLogTable).values({ type, description, userId }).catch(() => {});
}

// ─── Leaderboard & Stats ──────────────────────────────────────────────────────

export async function getTopEarners(limit = 10) {
  const { desc } = await import("drizzle-orm");
  return db.select({
    id:          usersTable.id,
    firstName:   usersTable.firstName,
    username:    usersTable.username,
    totalEarned: usersTable.totalEarned,
  }).from(usersTable)
    .where(eq(usersTable.isBanned, false))
    .orderBy(desc(usersTable.totalEarned))
    .limit(limit);
}

export async function getBotStats() {
  const { sum, count } = await import("drizzle-orm");
  const [userRow] = await db.select({ total: count() }).from(usersTable);
  const [earnRow] = await db.select({ total: sum(withdrawalsTable.amount) })
    .from(withdrawalsTable).where(eq(withdrawalsTable.status, "approved"));
  const [adsRow]  = await db.select({ total: sum(adsWatchedTable.count) }).from(adsWatchedTable);
  const [topRow]  = await db.select({ top: usersTable.totalEarned })
    .from(usersTable)
    .where(eq(usersTable.isBanned, false))
    .orderBy(sql`total_earned DESC`).limit(1);

  return {
    users:      userRow?.total ?? 0,
    totalPaid:  parseFloat(String(earnRow?.total ?? "0")).toFixed(2),
    totalAds:   Number(adsRow?.total ?? 0),
    topEarner:  parseFloat(String(topRow?.top ?? "0")).toFixed(2),
  };
}
