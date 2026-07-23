import { Router } from "express";
import { eq, and, or, like, desc, sql, count } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  usersTable, adsWatchedTable, withdrawalsTable,
  activityLogTable, referralsTable,
  channelsTable, botSettingsTable, userWarningsTable,
} from "@workspace/db";
import {
  GetAdminStatsResponse, ListUsersQueryParams, GetUserParams,
  BanUserParams, BanUserBody, AdjustBalanceParams, AdjustBalanceBody,
  ListWithdrawalsQueryParams, UpdateWithdrawalParams, UpdateWithdrawalBody,
  SendBroadcastBody,
} from "@workspace/api-zod";

const router = Router();

// GET /admin/stats
router.get("/stats", async (req, res) => {
  const today = new Date().toISOString().split("T")[0]!;

  const [totalUsersRow] = await db.select({ count: count() }).from(usersTable);
  const [activeRow] = await db.select({ count: count() }).from(usersTable)
    .where(sql`last_active::date = ${today}::date`);
  const [newUsersRow] = await db.select({ count: count() }).from(usersTable)
    .where(sql`created_at::date = ${today}::date`);
  const [earningsRow] = await db.select({ total: sql<string>`coalesce(sum(total_earned), 0)` }).from(usersTable);
  const [withdrawnRow] = await db.select({ total: sql<string>`coalesce(sum(amount), 0)` }).from(withdrawalsTable)
    .where(eq(withdrawalsTable.status, "approved"));
  const [pendingRow] = await db.select({ count: count(), total: sql<string>`coalesce(sum(amount), 0)` })
    .from(withdrawalsTable).where(eq(withdrawalsTable.status, "pending"));
  const [adsRow] = await db.select({ total: sql<string>`coalesce(sum(count), 0)` }).from(adsWatchedTable)
    .where(eq(adsWatchedTable.watchDate, today));
  const [referralsRow] = await db.select({ count: count() }).from(referralsTable);

  const stats = GetAdminStatsResponse.parse({
    totalUsers: totalUsersRow?.count ?? 0,
    activeToday: activeRow?.count ?? 0,
    totalEarnings: parseFloat(earningsRow?.total ?? "0"),
    pendingWithdrawals: pendingRow?.count ?? 0,
    pendingWithdrawalAmount: parseFloat(pendingRow?.total ?? "0"),
    totalWithdrawn: parseFloat(withdrawnRow?.total ?? "0"),
    adsWatchedToday: parseInt(adsRow?.total ?? "0"),
    newUsersToday: newUsersRow?.count ?? 0,
    totalReferrals: referralsRow?.count ?? 0,
  });

  res.json(stats);
});

// GET /admin/users
router.get("/users", async (req, res) => {
  const params = ListUsersQueryParams.parse(req.query);
  const page = params.page ?? 1;
  const limit = params.limit ?? 50;
  const offset = (page - 1) * limit;

  let query = db.select().from(usersTable).$dynamic();
  let countQuery = db.select({ count: count() }).from(usersTable).$dynamic();

  if (params.search) {
    const s = `%${params.search}%`;
    query = query.where(or(like(usersTable.firstName, s), like(usersTable.username, s)));
    countQuery = countQuery.where(or(like(usersTable.firstName, s), like(usersTable.username, s)));
  }
  if (params.status === "active") {
    query = query.where(eq(usersTable.isBanned, false));
    countQuery = countQuery.where(eq(usersTable.isBanned, false));
  } else if (params.status === "banned") {
    query = query.where(eq(usersTable.isBanned, true));
    countQuery = countQuery.where(eq(usersTable.isBanned, true));
  }

  const [users, totalRow] = await Promise.all([
    query.orderBy(desc(usersTable.createdAt)).limit(limit).offset(offset),
    countQuery,
  ]);

  res.json({
    users: users.map(u => ({
      ...u,
      balance: parseFloat(String(u.balance)),
      totalEarned: parseFloat(String(u.totalEarned)),
      createdAt: u.createdAt.toISOString(),
    })),
    total: totalRow[0]?.count ?? 0,
    page,
    limit,
  });
});

// GET /admin/users/:userId
router.get("/users/:userId", async (req, res) => {
  const { userId } = GetUserParams.parse({ userId: parseInt(req.params.userId!) });
  const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user[0]) return res.status(404).json({ error: "Not found" });

  const today = new Date().toISOString().split("T")[0]!;
  const [todayAds] = await db.select().from(adsWatchedTable)
    .where(and(eq(adsWatchedTable.userId, userId), eq(adsWatchedTable.watchDate, today)));
  const [totalAdsRow] = await db.select({ total: sql<string>`coalesce(sum(count), 0)` })
    .from(adsWatchedTable).where(eq(adsWatchedTable.userId, userId));
  const [referralCountRow] = await db.select({ count: count() }).from(referralsTable)
    .where(eq(referralsTable.referrerId, userId));
  const [wdCountRow] = await db.select({ count: count() }).from(withdrawalsTable)
    .where(eq(withdrawalsTable.userId, userId));

  const u = user[0]!;
  res.json({
    user: {
      ...u,
      balance: parseFloat(String(u.balance)),
      totalEarned: parseFloat(String(u.totalEarned)),
      createdAt: u.createdAt.toISOString(),
    },
    adsToday: todayAds?.count ?? 0,
    totalAdsWatched: parseInt(totalAdsRow?.total ?? "0"),
    referralCount: referralCountRow?.count ?? 0,
    withdrawalCount: wdCountRow?.count ?? 0,
  });
  return;
});

// POST /admin/users/:userId/ban
router.post("/users/:userId/ban", async (req, res) => {
  const { userId } = BanUserParams.parse({ userId: parseInt(req.params.userId!) });
  const { banned } = BanUserBody.parse(req.body);

  const [updated] = await db.update(usersTable)
    .set({ isBanned: banned })
    .where(eq(usersTable.id, userId))
    .returning();

  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...updated, balance: parseFloat(String(updated.balance)), totalEarned: parseFloat(String(updated.totalEarned)), createdAt: updated.createdAt.toISOString() });
  return;
});

// PATCH /admin/users/:userId/balance
router.patch("/users/:userId/balance", async (req, res) => {
  const { userId } = AdjustBalanceParams.parse({ userId: parseInt(req.params.userId!) });
  const { amount } = AdjustBalanceBody.parse(req.body);

  const [updated] = await db.update(usersTable)
    .set({
      balance: sql`balance + ${amount}`,
      totalEarned: amount > 0 ? sql`total_earned + ${amount}` : usersTable.totalEarned,
    })
    .where(eq(usersTable.id, userId))
    .returning();

  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...updated, balance: parseFloat(String(updated.balance)), totalEarned: parseFloat(String(updated.totalEarned)), createdAt: updated.createdAt.toISOString() });
  return;
});

// GET /admin/withdrawals
router.get("/withdrawals", async (req, res) => {
  const params = ListWithdrawalsQueryParams.parse(req.query);
  const page = params.page ?? 1;
  const limit = params.limit ?? 50;
  const offset = (page - 1) * limit;

  let query = db
    .select({
      id: withdrawalsTable.id,
      userId: withdrawalsTable.userId,
      userFirstName: usersTable.firstName,
      userUsername: usersTable.username,
      amount: withdrawalsTable.amount,
      method: withdrawalsTable.method,
      address: withdrawalsTable.address,
      status: withdrawalsTable.status,
      note: withdrawalsTable.note,
      createdAt: withdrawalsTable.createdAt,
      updatedAt: withdrawalsTable.updatedAt,
    })
    .from(withdrawalsTable)
    .leftJoin(usersTable, eq(withdrawalsTable.userId, usersTable.id))
    .$dynamic();

  let countQ = db.select({ count: count() }).from(withdrawalsTable).$dynamic();

  if (params.status && params.status !== "all") {
    query = query.where(eq(withdrawalsTable.status, params.status));
    countQ = countQ.where(eq(withdrawalsTable.status, params.status));
  }

  const [withdrawals, totalRow] = await Promise.all([
    query.orderBy(desc(withdrawalsTable.createdAt)).limit(limit).offset(offset),
    countQ,
  ]);

  res.json({
    withdrawals: withdrawals.map(w => ({
      ...w,
      amount: parseFloat(String(w.amount)),
      createdAt: w.createdAt.toISOString(),
      updatedAt: w.updatedAt?.toISOString() ?? null,
    })),
    total: totalRow[0]?.count ?? 0,
    page,
    limit,
  });
});

// PATCH /admin/withdrawals/:withdrawalId
router.patch("/withdrawals/:withdrawalId", async (req, res) => {
  const { withdrawalId } = UpdateWithdrawalParams.parse({ withdrawalId: parseInt(req.params.withdrawalId!) });
  const { status, note } = UpdateWithdrawalBody.parse(req.body);

  const [existing] = await db.select().from(withdrawalsTable).where(eq(withdrawalsTable.id, withdrawalId));
  if (!existing) { res.status(404).json({ error: "Not found" }); return; }

  // If rejecting, refund balance
  if (status === "rejected" && existing.status === "pending") {
    await db.update(usersTable)
      .set({ balance: sql`balance + ${existing.amount}` })
      .where(eq(usersTable.id, existing.userId));
  }

  const [updated] = await db.update(withdrawalsTable)
    .set({ status, note: note ?? null, updatedAt: new Date() })
    .where(eq(withdrawalsTable.id, withdrawalId))
    .returning();

  res.json({
    ...updated!,
    amount: parseFloat(String(updated!.amount)),
    createdAt: updated!.createdAt.toISOString(),
    updatedAt: updated!.updatedAt?.toISOString() ?? null,
  });
  return;
});

// POST /admin/broadcast
router.post("/broadcast", async (req, res) => {
  const { message, language } = SendBroadcastBody.parse(req.body);

  let query = db.select({ telegramId: usersTable.telegramId, isBanned: usersTable.isBanned })
    .from(usersTable)
    .$dynamic();

  if (language) {
    query = query.where(and(eq(usersTable.language, language), eq(usersTable.isBanned, false)));
  } else {
    query = query.where(eq(usersTable.isBanned, false));
  }

  const users = await query;
  let sent = 0;
  let failed = 0;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (token) {
    for (const user of users) {
      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: user.telegramId, text: message, parse_mode: "HTML" }),
        });
        sent++;
      } catch {
        failed++;
      }
      // Small delay to avoid rate limit
      await new Promise(r => setTimeout(r, 50));
    }
  } else {
    failed = users.length;
  }

  res.json({ sent, failed });
});

// GET /admin/activity
router.get("/activity", async (req, res) => {
  const rows = await db.select().from(activityLogTable)
    .orderBy(desc(activityLogTable.createdAt))
    .limit(50);

  res.json(rows.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  })));
});

// ─── Channels ─────────────────────────────────────────────────────────────────

interface ChannelBody {
  telegramId: string;
  name: string;
  url: string;
  reward?: number;
  isActive?: boolean;
  sortOrder?: number;
}

// GET /admin/channels
router.get("/channels", async (_req, res) => {
  const rows = await db.select().from(channelsTable).orderBy(channelsTable.sortOrder, channelsTable.id);
  res.json(rows.map(r => ({ ...r, reward: parseFloat(String(r.reward)), createdAt: r.createdAt.toISOString() })));
});

// POST /admin/channels
router.post("/channels", async (req, res) => {
  const body = req.body as ChannelBody;
  if (!body.telegramId || !body.name || !body.url) {
    res.status(400).json({ error: "telegramId, name, url required" }); return;
  }
  const [row] = await db.insert(channelsTable).values({
    telegramId: body.telegramId,
    name: body.name,
    url: body.url,
    reward: String(body.reward ?? 0.05),
    isActive: body.isActive ?? true,
    sortOrder: body.sortOrder ?? 0,
  }).returning();
  res.status(201).json({ ...row!, reward: parseFloat(String(row!.reward)), createdAt: row!.createdAt.toISOString() });
});

// PATCH /admin/channels/:id
router.patch("/channels/:id", async (req, res) => {
  const id = parseInt(req.params.id!);
  const body = req.body as Partial<ChannelBody>;
  const set: Partial<typeof channelsTable.$inferInsert> = {};
  if (body.telegramId !== undefined) set.telegramId = body.telegramId;
  if (body.name !== undefined) set.name = body.name;
  if (body.url !== undefined) set.url = body.url;
  if (body.reward !== undefined) set.reward = String(body.reward);
  if (body.isActive !== undefined) set.isActive = body.isActive;
  if (body.sortOrder !== undefined) set.sortOrder = body.sortOrder;

  const [updated] = await db.update(channelsTable).set(set).where(eq(channelsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...updated, reward: parseFloat(String(updated.reward)), createdAt: updated.createdAt.toISOString() });
});

// DELETE /admin/channels/:id
router.delete("/channels/:id", async (req, res) => {
  const id = parseInt(req.params.id!);
  await db.delete(channelsTable).where(eq(channelsTable.id, id));
  res.json({ ok: true });
});

// ─── Settings ─────────────────────────────────────────────────────────────────

// GET /admin/settings
router.get("/settings", async (_req, res) => {
  const rows = await db.select().from(botSettingsTable);
  const settings: Record<string, { value: string; description: string | null }> = {};
  for (const r of rows) settings[r.key] = { value: r.value, description: r.description ?? null };
  res.json(settings);
});

// PATCH /admin/settings  — body: { key: value, ... }
router.patch("/settings", async (req, res) => {
  const body = req.body as Record<string, unknown>;
  const updated: string[] = [];
  for (const [k, v] of Object.entries(body)) {
    if (typeof v !== "string" && typeof v !== "number") continue;
    const val = String(v);
    await db.insert(botSettingsTable)
      .values({ key: k, value: val })
      .onConflictDoUpdate({ target: botSettingsTable.key, set: { value: val, updatedAt: new Date() } });
    updated.push(k);
  }
  res.json({ ok: true, updated: updated.length });
});

// ─── Warnings ─────────────────────────────────────────────────────────────────

// GET /admin/warnings?userId=&page=&limit=
router.get("/warnings", async (req, res) => {
  const { userId, page: pageStr, limit: limitStr } = req.query as Record<string, string>;
  const page  = parseInt(pageStr  ?? "1");
  const limit = parseInt(limitStr ?? "50");
  const offset = (page - 1) * limit;

  const where = userId ? eq(userWarningsTable.userId, parseInt(userId)) : undefined;

  const rows = await db.select({
    id: userWarningsTable.id,
    userId: userWarningsTable.userId,
    reason: userWarningsTable.reason,
    issuedBy: userWarningsTable.issuedBy,
    createdAt: userWarningsTable.createdAt,
    firstName: usersTable.firstName,
    username: usersTable.username,
  })
    .from(userWarningsTable)
    .leftJoin(usersTable, eq(userWarningsTable.userId, usersTable.id))
    .where(where)
    .orderBy(desc(userWarningsTable.createdAt))
    .limit(limit).offset(offset);

  const [totalRow] = await db.select({ count: count() }).from(userWarningsTable).where(where);

  res.json({
    warnings: rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })),
    total: totalRow?.count ?? 0,
    page,
    limit,
  });
});

// POST /admin/users/:userId/warn
router.post("/users/:userId/warn", async (req, res) => {
  const userId = parseInt(req.params.userId!);
  const reason = String((req.body as { reason?: string }).reason ?? "").trim();
  if (!reason) { res.status(400).json({ error: "reason required" }); return; }

  const user = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user[0]) { res.status(404).json({ error: "Not found" }); return; }

  await db.insert(userWarningsTable).values({ userId, reason, issuedBy: "admin" });

  const [warnRow] = await db.select({ cnt: count() }).from(userWarningsTable).where(eq(userWarningsTable.userId, userId));
  res.json({ ok: true, warningCount: warnRow?.cnt ?? 0 });
});

// DELETE /admin/warnings/:id
router.delete("/warnings/:id", async (req, res) => {
  const id = parseInt(req.params.id!);
  await db.delete(userWarningsTable).where(eq(userWarningsTable.id, id));
  res.json({ ok: true });
});

export default router;
