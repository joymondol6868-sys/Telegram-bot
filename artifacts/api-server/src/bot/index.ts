import { Bot, InlineKeyboard, Keyboard, session, webhookCallback } from "grammy";
import type { Context, SessionFlavor } from "grammy";
import type { Express } from "express";
import { logger } from "../lib/logger.js";
import {
  getOrCreateUser, getUserByTelegramId, setUserLanguage,
  getTodayAds, startAdWatch, completeAdWatch,
  getOrCreateDailyTask, markTaskShare, claimDailyBonus,
  getReferralStats, getReferralBonusLimit, createWithdrawal, getWalletStats, getUserWithdrawalHistory,
  getActiveChannels, getRequiredChannels, recordChannelJoin, getChannelJoin,
  completeReferralIfPending,
  getWarningCount, getSuspension, issueAdAbandonStrike,
  getNumSetting, seedSettings, saveUserPanelMsg,
  updateUserWallet, updateUserName,
  getTopEarners, getBotStats,
} from "./db.js";
import { tr_, LANGUAGES, bar, escHtml, type Lang } from "./languages.js";

// ─── Session ──────────────────────────────────────────────────────────────────

interface SessionData {
  pendingForceJoinAction?: string; // which gated action to resume after force_join_verify passes
  state?:
    | "selecting_wallet_method"    // on wallet select keyboard (profile flow)
    | "selecting_withdraw_method"  // on withdraw method keyboard
    | "await_wallet_address"       // typing wallet number/address
    | "await_withdraw_address"     // typing withdrawal address
    | "await_withdraw_confirm"     // confirming withdrawal
    | "await_name_update";         // typing new name
  withdrawMethod?: string;
  walletMethod?:   string;
  pendingAddress?: string;
  panelMsgId?:     number;
  panelType?:      string;   // tracks what kind of panel is currently showing
}
type BotCtx = Context & SessionFlavor<SessionData>;
type FullUser = Awaited<ReturnType<typeof getUserByTelegramId>>;

// ─── Env ──────────────────────────────────────────────────────────────────────

let BOT_USERNAME   = process.env.BOT_USERNAME   ?? "";
const ADULT_BOT_LINK = process.env.ADULT_BOT_LINK ?? "https://t.me/example_adult_bot";
const MOVIE_BOT_LINK = process.env.MOVIE_BOT_LINK ?? "https://t.me/example_movie_bot";
const ADS_URL        = process.env.ADS_URL        ?? "https://www.google.com";

// ─── Payment Methods ──────────────────────────────────────────────────────────

const WITHDRAW_METHODS = [
  { id: "bkash",      emoji: "📱", label: "bKash",          country: "🇧🇩" },
  { id: "nagad",      emoji: "💚", label: "Nagad",          country: "🇧🇩" },
  { id: "rocket",     emoji: "🚀", label: "Rocket",         country: "🇧🇩" },
  { id: "upi",        emoji: "🇮🇳", label: "UPI",            country: "🇮🇳" },
  { id: "paytm",      emoji: "🔵", label: "Paytm",          country: "🇮🇳" },
  { id: "binancepay", emoji: "💛", label: "Binance Pay",    country: "🌐" },
  { id: "usdt_trc20", emoji: "💎", label: "USDT (TRC-20)",  country: "🌐" },
  { id: "usdt_bep20", emoji: "💜", label: "USDT (BEP-20)",  country: "🌐" },
  { id: "bnb",        emoji: "🟡", label: "BNB (BSC)",      country: "🌐" },
  { id: "paypal",     emoji: "🔷", label: "PayPal",         country: "🌐" },
  { id: "ton",        emoji: "💠", label: "TON",            country: "🌐" },
  { id: "ltc",        emoji: "⚪", label: "Litecoin (LTC)", country: "🌐" },
] as const;

function getMethodLabel(id: string): string {
  if (id === "bkash_nagad") return "🟢 bKash / Nagad";
  const m = WITHDRAW_METHODS.find(x => x.id === id);
  return m ? `${m.emoji} ${m.label}` : id.toUpperCase();
}

// Returns the method id for a keyboard button text like "🇧🇩 📱 bKash"
function getMethodIdFromBtnText(text: string): string | undefined {
  return WITHDRAW_METHODS.find(m => text === `${m.country} ${m.emoji} ${m.label}`)?.id;
}

// ─── Wallet address examples per method ──────────────────────────────────────

function getWalletExample(methodId: string): string {
  const MAP: Record<string, string> = {
    bkash:       "01712345678",
    nagad:       "01812345678",
    rocket:      "01612345678",
    upi:         "9876543210@paytm",
    paytm:       "9876543210",
    binancepay:  "123456789",
    usdt_trc20:  "TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y",
    usdt_bep20:  "0x1234567890abcdef1234567890abcdef12345678",
    bnb:         "0x1234567890abcdef1234567890abcdef12345678",
    paypal:      "example@email.com",
    ton:         "UQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ltc:         "Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  };
  return MAP[methodId] ?? "";
}

function getWalletPromptKey(methodId: string): string {
  if (methodId === "usdt_trc20") return "walletPromptUsdt";
  if (methodId === "binancepay") return "walletPromptBinance";
  if (methodId === "bkash" || methodId === "nagad" || methodId === "rocket") return "walletPromptMobile";
  if (methodId === "upi") return "walletPromptUpi";
  return "enterWalletAddress";
}

function getWalletInvalidKey(methodId: string): string {
  if (methodId === "usdt_trc20") return "walletInvalidUsdt";
  if (methodId === "binancepay") return "walletInvalidBinance";
  if (methodId === "upi") return "walletInvalidUpi";
  return "walletInvalidGeneric";
}

function isValidWalletInput(methodId: string, value: string): boolean {
  if (methodId === "bkash" || methodId === "nagad" || methodId === "rocket") return /^01\d{9}$/.test(value);
  if (methodId === "paytm") return /^\d{10}$/.test(value);
  if (methodId === "binancepay") return /^\d{8,10}$/.test(value);
  if (methodId === "usdt_trc20") return /^T[a-zA-Z0-9]{33}$/.test(value);
  if (methodId === "usdt_bep20" || methodId === "bnb") return /^0x[a-fA-F0-9]{40}$/.test(value);
  if (methodId === "paypal") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (methodId === "ton") return /^[EU][A-Za-z0-9_-]{47}$/.test(value);
  if (methodId === "ltc") return /^[LM3][A-Za-z0-9]{25,40}$/.test(value);
  if (methodId === "upi") return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(value);
  return false;
}

function previewWalletAddress(value: string): string {
  return value.length > 20 ? `${value.slice(0, 18)}...` : value;
}

function walletInputPrompt(lang: Lang, methodId: string): string {
  return tr_(lang, getWalletPromptKey(methodId), {
    method: getMethodLabel(methodId),
    example: getWalletExample(methodId),
  });
}

function walletInputInvalid(lang: Lang, methodId: string): string {
  return tr_(lang, getWalletInvalidKey(methodId), {
    method: getMethodLabel(methodId),
    example: getWalletExample(methodId),
  });
}

// ─── Decorative constants ─────────────────────────────────────────────────────

const HTML = { parse_mode: "HTML" as const };
const SEP  = "━━━━━━━━━━━━━━━━━━━━━";
const LINE = "─────────────────────";

// ─── Main menu inline keyboard — colored buttons inside bot message ───────────

/** Main Menu — persistent Reply Keyboard (bottom menu), not inline. */
function mainMenu(lang: Lang): Keyboard {
  return new Keyboard()
    .add({ text: tr_(lang, "watchAdsEarnBtn"), style: "success" }).row()
    .add({ text: tr_(lang, "walletBtn"),       style: "primary" })
    .add({ text: tr_(lang, "dashboardBtn"),    style: "primary" }).row()
    .add({ text: tr_(lang, "rewardsBtn"),      style: "danger"  })
    .add({ text: tr_(lang, "referralsBtn"),    style: "success" }).row()
    .add({ text: tr_(lang, "videoZoneBtn"),    style: "danger"  })
    .add({ text: tr_(lang, "channelBtn"),      style: "success" }).row()
    .add({ text: tr_(lang, "settingsBtn"),     style: "primary" })
    .add({ text: tr_(lang, "supportBtn"),      style: "primary" })
    .resized()
    .persistent();
}

// ─── Rank helpers ─────────────────────────────────────────────────────────────

function getRank(totalEarned: number): { badge: string; name: string; next: number | null } {
  if (totalEarned >= 50) return { badge: "👑", name: "Legend",  next: null };
  if (totalEarned >= 20) return { badge: "💎", name: "Diamond", next: 50 };
  if (totalEarned >= 5)  return { badge: "🥇", name: "Gold",    next: 20 };
  if (totalEarned >= 1)  return { badge: "🥈", name: "Silver",  next: 5  };
  return                         { badge: "🥉", name: "Bronze",  next: 1  };
}

function rankProgressBar(current: number, next: number | null, w = 8): string {
  if (next === null) return "▰".repeat(w);
  const pct = Math.min(current / next, 1);
  const filled = Math.round(pct * w);
  return "▰".repeat(filled) + "░".repeat(w - filled);
}

function withdrawMethodInlineMenu(lang: Lang, backCallback = "wallet_overview"): InlineKeyboard {
  const kbd = new InlineKeyboard();
  for (let i = 0; i < WITHDRAW_METHODS.length; i += 2) {
    const a = WITHDRAW_METHODS[i]!;
    const b = WITHDRAW_METHODS[i + 1];
    kbd.add({ text: `${a.country} ${a.emoji} ${a.label}`, callback_data: `wd_method:${a.id}`, style: "primary" });
    if (b) {
      kbd.add({ text: `${b.country} ${b.emoji} ${b.label}`, callback_data: `wd_method:${b.id}`, style: "success" });
    }
    kbd.row();
  }
  kbd.add({ text: tr_(lang, "backBtn"), callback_data: backCallback });
  return kbd;
}

function walletMethodInlineMenu(lang: Lang): InlineKeyboard {
  const kbd = new InlineKeyboard();
  for (let i = 0; i < WITHDRAW_METHODS.length; i += 2) {
    const a = WITHDRAW_METHODS[i]!;
    const b = WITHDRAW_METHODS[i + 1];
    kbd.add({ text: `${a.country} ${a.emoji} ${a.label}`, callback_data: `wallet_method:${a.id}`, style: "primary" });
    if (b) {
      kbd.add({ text: `${b.country} ${b.emoji} ${b.label}`, callback_data: `wallet_method:${b.id}`, style: "success" });
    }
    kbd.row();
  }
  kbd.add({ text: tr_(lang, "backBtn"), callback_data: "wallet_overview" });
  return kbd;
}

function inlineCancelMenu(lang: Lang, backCallback = "wallet_overview"): InlineKeyboard {
  return new InlineKeyboard()
    .add({ text: tr_(lang, "backBtn"), callback_data: backCallback, style: "danger" });
}

function inlineConfirmMenu(lang: Lang, backCallback = "wallet_overview"): InlineKeyboard {
  return new InlineKeyboard()
    .add({ text: tr_(lang, "confirmBtn"), callback_data: "wallet_confirm", style: "success" }).row()
    .add({ text: tr_(lang, "changeMethodBtn"), callback_data: "wallet_change", style: "primary" }).row()
    .add({ text: tr_(lang, "backBtn"), callback_data: backCallback, style: "danger" });
}

function profileSubMenu(lang: Lang): InlineKeyboard {
  return new InlineKeyboard()
    .add({ text: tr_(lang, "setPayoutWalletBtn"), callback_data: "dash_wallet", style: "primary" }).row()
    .add({ text: tr_(lang, "requestWithdrawalBtn"), callback_data: "dash_withdraw", style: "success" }).row()
    .add({ text: tr_(lang, "backBtn"), callback_data: "go_dashboard", style: "danger" });
}

function walletSavedMenu(lang: Lang): InlineKeyboard {
  return new InlineKeyboard()
    .add({ text: tr_(lang, "requestWithdrawalBtn"), callback_data: "wallet_request", style: "success" }).row()
    .add({ text: tr_(lang, "backBtn"), callback_data: "wallet_overview", style: "danger" });
}

function cancelMenu(lang: Lang, backCallback = "go_dashboard"): InlineKeyboard {
  return new InlineKeyboard()
    .add({ text: tr_(lang, "backBtn"), callback_data: backCallback, style: "danger" });
}

// ─── Inline keyboard for language select ─────────────────────────────────────

// Language button label -> language code. Shared between the Keyboard builder
// below and the message:text handler that reads the pressed label back.
const LANG_BUTTONS: Array<{ text: string; code: Lang; style: "primary" | "success" | "danger" }> = [
  { text: "🇬🇧 English",   code: "en", style: "primary" },
  { text: "🇧🇩 বাংলা",     code: "bn", style: "success" },
  { text: "🇮🇳 हिन्दी",   code: "hi", style: "danger"  },
  { text: "🇸🇦 العربية",   code: "ar", style: "primary" },
  { text: "🇷🇺 Русский",   code: "ru", style: "success" },
  { text: "🇹🇷 Türkçe",    code: "tr", style: "danger"  },
  { text: "🇵🇰 اردو",      code: "ur", style: "primary" },
  { text: "🇮🇳 ਪੰਜਾਬੀ",   code: "pa", style: "success" },
  { text: "🇮🇩 Indonesia", code: "id", style: "danger"  },
  { text: "🇫🇷 Français",  code: "fr", style: "primary" },
  { text: "🇪🇸 Español",   code: "es", style: "success" },
  { text: "🇧🇷 Português", code: "pt", style: "danger"  },
];

function langKeyboard(): Keyboard {
  const kbd = new Keyboard();
  LANG_BUTTONS.forEach((b, i) => {
    kbd.add({ text: b.text, style: b.style });
    if (i % 3 === 2) kbd.row();
  });
  return kbd.resized();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getReferralLink(referralCode: string): string {
  if (!BOT_USERNAME) return "⚠️ Bot username not configured";
  return `https://t.me/${BOT_USERNAME}?start=ref_${referralCode}`;
}

/** Delete previous panel + user message, send fresh panel with updated keyboard */
async function showPanel(
  ctx: BotCtx,
  text: string,
  extra: Record<string, unknown> = {},
  panelType?: string,
): Promise<void> {
  const chatId = ctx.chat?.id;
  if (!chatId) return;
  const tgId = String(ctx.from?.id ?? "");

  // Callback navigation must keep the same bot message and only replace its
  // text/inline keyboard. This is the primary panel navigation path.
  const callbackMessageId = ctx.callbackQuery?.message?.message_id;
  if (callbackMessageId) {
    const updated = await ctx.api.editMessageText(chatId, callbackMessageId, text, {
      ...HTML,
      ...extra,
    } as any).then(() => true).catch(() => false);
    if (updated) {
      ctx.session.panelMsgId = callbackMessageId;
      ctx.session.panelType = panelType;
      await saveUserPanelMsg(tgId, callbackMessageId).catch(() => {});
      return;
    }
  }

  // Only delete the previous panel when:
  //  • no type is given (force-replace, e.g. sub-menu navigation), OR
  //  • the same panel type is being shown again (avoid duplicates)
  const sameType = !panelType || ctx.session.panelType === panelType;
  if (sameType && ctx.session.panelMsgId) {
    await ctx.api.deleteMessage(chatId, ctx.session.panelMsgId).catch(() => {});
    ctx.session.panelMsgId = undefined;
  }
  if (ctx.message?.message_id) {
    await ctx.api.deleteMessage(chatId, ctx.message.message_id).catch(() => {});
  }

  const sent = await ctx.api.sendMessage(chatId, text, { ...HTML, ...extra } as any);
  ctx.session.panelMsgId = sent.message_id;
  ctx.session.panelType  = panelType;
  if (tgId) await saveUserPanelMsg(tgId, sent.message_id).catch(() => {});
}

/** Update the current bot panel in place; only falls back to a new panel if needed. */
async function editPanel(
  ctx: BotCtx,
  text: string,
  extra: Record<string, unknown> = {},
): Promise<void> {
  const chatId = ctx.chat?.id;
  const messageId = ctx.session.panelMsgId ?? ctx.callbackQuery?.message?.message_id;
  if (chatId && messageId) {
    const updated = await ctx.api.editMessageText(chatId, messageId, text, { ...HTML, ...extra } as any)
      .then(() => true)
      .catch(() => false);
    if (updated) {
      ctx.session.panelMsgId = messageId;
      return;
    }
  }
  await showPanel(ctx, text, extra);
}

function clearState(ctx: BotCtx) {
  ctx.session.state          = undefined;
  ctx.session.withdrawMethod = undefined;
  ctx.session.walletMethod   = undefined;
  ctx.session.pendingAddress = undefined;
}

async function deleteIncomingMessage(ctx: BotCtx): Promise<void> {
  if (ctx.message?.message_id && ctx.chat?.id) {
    await ctx.api.deleteMessage(ctx.chat.id, ctx.message.message_id).catch(() => {});
  }
}

/** Show main menu — sends or edits the bot message with the colored inline keyboard */
async function showMainMenuPanel(ctx: BotCtx, lang: Lang, dbUser: NonNullable<FullUser>) {
  const refs    = await getReferralStats(dbUser.id);
  const balance = Number(dbUser.balance).toFixed(2);
  const text    = tr_(lang, "menuMsg", {
    name:    dbUser.firstName,
    id:      dbUser.id,
    balance,
    refs:    refs.count,
  });
  await showPanel(ctx, text, { reply_markup: mainMenu(lang) }, "main");
}

function buildLangSetMessage(lang: Lang): string {
  const MAP: Record<Lang, { flag: string; native: string; english: string }> = {
    en: { flag: "🇬🇧", native: "Language set to English!",       english: "English"    },
    bn: { flag: "🇧🇩", native: "ভাষা বাংলায় সেট হয়েছে!",         english: "Bengali"    },
    hi: { flag: "🇮🇳", native: "भाषा हिंदी में सेट हो गई!",        english: "Hindi"      },
    ar: { flag: "🇸🇦", native: "تم تعيين اللغة إلى العربية!",     english: "Arabic"     },
    ru: { flag: "🇷🇺", native: "Язык установлен на русский!",     english: "Russian"    },
    tr: { flag: "🇹🇷", native: "Dil Türkçe olarak ayarlandı!",    english: "Turkish"    },
    ur: { flag: "🇵🇰", native: "زبان اردو پر سیٹ ہو گئی!",      english: "Urdu"       },
    pa: { flag: "🇮🇳", native: "ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਸੈੱਟ ਹੋਈ!",     english: "Punjabi"    },
    id: { flag: "🇮🇩", native: "Bahasa diatur ke Indonesia!",    english: "Indonesian" },
    fr: { flag: "🇫🇷", native: "Langue réglée sur le français!", english: "French"     },
    es: { flag: "🇪🇸", native: "¡Idioma establecido en Español!", english: "Spanish"   },
    pt: { flag: "🇧🇷", native: "Idioma definido para Português!", english: "Portuguese" },
  };
  const { flag, native, english } = MAP[lang];
  return `${flag} <b>${native}</b>
<code>${SEP}</code>
✅ <b>${english}</b> selected successfully
🌐 All bot messages will now appear in your language
<code>${LINE}</code>
⚡ <i>Loading your personal dashboard...</i>`;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export async function startBot(expressApp?: Express) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) { logger.warn("TELEGRAM_BOT_TOKEN not set — bot will not start"); return; }

  await seedSettings();

  const bot = new Bot<BotCtx>(token);
  bot.use(session({ initial: (): SessionData => ({}) }));
  bot.catch((err) => logger.error({ err: err.error }, "Bot error"));

  await bot.init();
  if (!BOT_USERNAME) BOT_USERNAME = bot.botInfo.username;
  logger.info({ username: BOT_USERNAME }, "Bot username resolved");

  // ── Channel helpers (need bot in scope) ─────────────────────────────────

  async function checkChannelMembershipByTgId(chatId: string, tgUserId: number): Promise<boolean> {
    try {
      const member = await bot.api.getChatMember(chatId, tgUserId);
      return ["member", "administrator", "creator"].includes(member.status);
    } catch { return false; }
  }

  async function checkChannelMembership(channelId: number, tgUserId: number): Promise<boolean> {
    const { db, channelsTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");
    const rows = await db.select().from(channelsTable).where(eq(channelsTable.id, channelId)).limit(1);
    if (!rows[0]) return false;
    return checkChannelMembershipByTgId(rows[0].telegramId, tgUserId);
  }

  async function getUnjoinedChannels(
    userId: number, tgUserId: number,
    channels: Array<{ id: number; telegramId: string; name: string; url: string; reward: string }>,
  ) {
    const unjoined: typeof channels = [];
    for (const ch of channels) {
      const join = await getChannelJoin(userId, ch.id);
      if (join?.rewardPaid) continue;
      if (!await checkChannelMembershipByTgId(ch.telegramId, tgUserId)) unjoined.push(ch);
    }
    return unjoined;
  }

  /**
   * Force-join gate for money-moving actions (Watch Ad, Daily Bonus,
   * Withdrawal). Unlike getUnjoinedChannels above (which skips channels
   * already reward-paid for the one-time channel-join task), this ALWAYS
   * live-checks required channels — this is an access gate, not a
   * one-time task, so a past reward never grandfathers someone back in
   * after they've left.
   *
   * On first successful pass for a referred user, also flips their
   * pending referral to "success" and pays the referrer — see
   * completeReferralIfPending(). Safe to call every time; no-op if
   * there's nothing pending.
   *
   * Returns true and calls `onPass()` if the gate is clear. Returns false
   * and shows the Join/Verify panel instead if channels are still missing.
   */
  async function requireForceJoin(
    ctx: BotCtx, lang: Lang, dbUser: NonNullable<FullUser>, actionTag: string, onPass: () => Promise<void>,
  ): Promise<boolean> {
    const required = await getRequiredChannels();
    if (required.length === 0) { await onPass(); return true; }

    const missing: typeof required = [];
    for (const ch of required) {
      if (!await checkChannelMembershipByTgId(ch.telegramId, ctx.from!.id)) missing.push(ch);
    }

    if (missing.length === 0) {
      await completeReferralIfPending(dbUser.id).catch(() => null);
      await onPass();
      return true;
    }

    ctx.session.pendingForceJoinAction = actionTag;
    const kbd = new InlineKeyboard();
    missing.forEach((ch) => {
      kbd.url(`📢 ${ch.name}`, ch.url).row();
    });
    kbd.add({ text: "✅ I've Joined — Verify", callback_data: "force_join_verify", style: "success" });
    await showPanel(
      ctx,
      `🔒 <b>Join Required</b>\n<code>${SEP}</code>\nJoin the channel(s) below to unlock Ads / Withdrawal / Daily Bonus, then tap Verify:`,
      { reply_markup: kbd },
    );
    return false;
  }

  // ── Panel helpers (need bot session in scope) ────────────────────────────

  function walletOverviewKeyboard(lang: Lang): InlineKeyboard {
    return new InlineKeyboard()
      .add({ text: tr_(lang, "requestWithdrawalBtn"), callback_data: "wallet_request", style: "success" }).row()
      .add({ text: tr_(lang, "setPayoutWalletBtn"), callback_data: "wallet_set", style: "primary" }).row()
      .add({ text: tr_(lang, "payoutHistoryBtn"), callback_data: "wallet_history", style: "primary" })
      .add({ text: tr_(lang, "paymentProofsBtn"), callback_data: "wallet_proofs", style: "success" }).row()
      .add({ text: "🔄 Refresh", callback_data: "refresh_wallet", style: "primary" }).row()
      .add({ text: tr_(lang, "walletMainBtn"), callback_data: "go_main" });
  }

  async function handleWalletOverview(ctx: BotCtx, lang: Lang, dbUser: NonNullable<FullUser>) {
    const [minWd, walletStats] = await Promise.all([
      getNumSetting("min_withdrawal", 0.50),
      getWalletStats(dbUser.id),
    ]);
    const text = tr_(lang, "walletOverviewMsg", {
      balance: Number(dbUser.balance).toFixed(2),
      totalWithdrawn: walletStats.totalWithdrawn.toFixed(2),
      minPayout: minWd.toFixed(2),
    });
    clearState(ctx);
    await editPanel(ctx, text, { reply_markup: walletOverviewKeyboard(lang) });
  }

  async function handleWalletSetPrompt(ctx: BotCtx, lang: Lang) {
    clearState(ctx);
    await editPanel(ctx, tr_(lang, "updateWalletMsg"), {
      reply_markup: walletMethodInlineMenu(lang),
    });
  }

  async function handleWithdrawalPrompt(ctx: BotCtx, lang: Lang, dbUser: NonNullable<FullUser>) {
    const balance = Number(dbUser.balance);
    const minWd = await getNumSetting("min_withdrawal", 0.50);
    if (balance < minWd) {
      await editPanel(ctx, tr_(lang, "withdrawLow", {
        balance: balance.toFixed(2),
        minWd: minWd.toFixed(2),
      }), { reply_markup: walletOverviewKeyboard(lang) });
      return;
    }
    await requireForceJoin(ctx, lang, dbUser, "withdraw", async () => {
      clearState(ctx);
      await editPanel(ctx, tr_(lang, "withdrawMsg", {
        balance: balance.toFixed(2),
        minWd: minWd.toFixed(2),
      }), { reply_markup: withdrawMethodInlineMenu(lang) });
    });
  }

  async function handleWalletHistory(ctx: BotCtx, lang: Lang, dbUser: NonNullable<FullUser>, proofsOnly = false) {
    const rows = await getUserWithdrawalHistory(dbUser.id);
    const visible = proofsOnly ? rows.filter(row => row.status === "approved") : rows;
    const lines = visible.map(row => {
      const date = new Date(row.createdAt).toLocaleDateString("en-GB");
      const status = row.status === "approved" ? "✅" : row.status === "rejected" ? "❌" : "⏳";
      const method = escHtml(getMethodLabel(row.method));
      const note = proofsOnly && row.note ? `\n   <i>${escHtml(row.note)}</i>` : "";
      return `${status} <b>$${Number(row.amount).toFixed(2)}</b> · ${method} · ${date}${note}`;
    });
    const key = proofsOnly ? "paymentProofsMsg" : "payoutHistoryMsg";
    const text = tr_(lang, key, {
      entries: lines.length ? lines.join("\n") : tr_(lang, proofsOnly ? "noPaymentProofs" : "noPayoutHistory"),
    });
    await editPanel(ctx, text, {
      reply_markup: new InlineKeyboard()
        .add({ text: tr_(lang, "backBtn"), callback_data: "wallet_overview" }),
    });
  }

  async function handleProfilePanel(ctx: BotCtx, lang: Lang, dbUser: NonNullable<FullUser>) {
    const [maxAds, warnLimit, minWd] = await Promise.all([
      getNumSetting("max_ads_per_day", 10),
      getNumSetting("warn_limit", 3),
      getNumSetting("min_withdrawal", 0.50),
    ]);
    const [todayAds, referrals, warnings] = await Promise.all([
      getTodayAds(dbUser.id),
      getReferralStats(dbUser.id),
      getWarningCount(dbUser.id),
    ]);
    const joinedDate = new Date(dbUser.createdAt);
    const joined = joinedDate.toLocaleDateString("en-GB");
    const days = Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));
    const walletLine = (dbUser as any).walletMethod
      ? `\n💳 Wallet:        <b>${getMethodLabel((dbUser as any).walletMethod)}</b>`
      : `\n💳 Wallet:        <i>Not set — tap Set Wallet below</i>`;

    const totalEarned = Number(dbUser.totalEarned);
    const rank = getRank(totalEarned);
    const rankBar = rankProgressBar(totalEarned, rank.next);
    const rankLine = rank.next !== null
      ? `\n${rank.badge} Rank: <b>${rank.name}</b>  <code>${rankBar}</code>  → <b>${rank.next}$ for ${rank.next === 1 ? "Silver" : rank.next === 5 ? "Gold" : rank.next === 20 ? "Diamond" : "Legend"}</b>`
      : `\n${rank.badge} Rank: <b>${rank.name}</b>  <code>${rankBar}</code>  🎉 <i>Max rank!</i>`;

    const text = tr_(lang, "profileMsg", {
      id:          dbUser.id,
      name:        dbUser.firstName,
      lang:        LANGUAGES[lang],
      balance:     Number(dbUser.balance).toFixed(2),
      totalEarned: totalEarned.toFixed(2),
      adsToday:    todayAds?.count ?? 0,
      maxAds,
      referrals:   referrals.count,
      warnings,
      warnLimit,
      minWd:       minWd.toFixed(2),
      joined,
      days,
    }) + walletLine + rankLine;

    const kbd = new Keyboard()
      .add({ text: tr_(lang, "changeNameBtn"), style: "primary" })
      .add({ text: tr_(lang, "changeLangBtn"), style: "success" }).row()
      .add({ text: tr_(lang, "setWalletBtn"),  style: "primary" }).row()
      .add({ text: tr_(lang, "withdrawalBtn"), style: "success" }).row()
      .add({ text: tr_(lang, "mainMenuBtn"), style: "danger" })
      .resized();
    await showPanel(ctx, text, { reply_markup: kbd });
  }

  async function handleVideoZonePanel(ctx: BotCtx, lang: Lang) {
    const kbd = new InlineKeyboard()
      .add({ text: "🔞 Adult Content",   url: ADULT_BOT_LINK, style: "danger"   }).row()
      .add({ text: "🎬 Movies & Series", url: MOVIE_BOT_LINK, style: "primary"  }).row()
      .add({ text: "🏠 " + tr_(lang, "mainMenuBtn").replace(/^🏠\s*/, ""), callback_data: "go_main", style: "danger" });
    await showPanel(ctx, `🎬 <b>VIDEO ZONE</b>\n<code>${SEP}</code>\n🍿 Select a category:`, { reply_markup: kbd });
  }

  async function handleChannelPanel(ctx: BotCtx, lang: Lang, dbUser: NonNullable<FullUser>) {
    const channels = await getActiveChannels();
    const kbd = new InlineKeyboard();
    if (channels.length === 0) {
      kbd.add({ text: "🏠 " + tr_(lang, "mainMenuBtn").replace(/^🏠\s*/, ""), callback_data: "go_main", style: "danger" });
      await showPanel(ctx, `📢 <b>CHANNELS</b>\n<code>${SEP}</code>\n<i>No active channels at the moment.</i>`, { reply_markup: kbd });
      return;
    }
    for (const ch of channels) {
      const join = await getChannelJoin(dbUser.id, ch.id);
      const status = join?.rewardPaid ? "✅" : "⬜";
      kbd.add({ text: `${status} ${ch.name}  +$${parseFloat(String(ch.reward)).toFixed(2)}`, url: ch.url, style: "primary" }).row();
      if (!join?.rewardPaid)
        kbd.add({ text: `✅ Verify — ${ch.name}`, callback_data: `task_channel:${ch.id}`, style: "success" }).row();
    }
    kbd.add({ text: "🏠 " + tr_(lang, "mainMenuBtn").replace(/^🏠\s*/, ""), callback_data: "go_main", style: "danger" });
    await showPanel(ctx, `📢 <b>CHANNELS</b>\n<code>${SEP}</code>\n💰 Join channels to earn instant rewards!`, { reply_markup: kbd });
  }

  async function handleSettingsPanel(ctx: BotCtx, lang: Lang) {
    const kbd = new Keyboard()
      .add({ text: tr_(lang, "changeNameBtn"), style: "primary" })
      .add({ text: tr_(lang, "changeLangBtn"), style: "success" }).row()
      .add({ text: tr_(lang, "mainMenuBtn"), style: "danger" })
      .resized();
    await showPanel(ctx, `⚙️ <b>SETTINGS</b>\n<code>${SEP}</code>\n🔧 Manage your account:`, { reply_markup: kbd });
  }

  async function buildEarnData(dbUser: NonNullable<FullUser>) {
    const BASE_LIMIT = 25;
    const [refs, todayAds] = await Promise.all([
      getReferralStats(dbUser.id),
      getTodayAds(dbUser.id),
    ]);
    const bonus_limit = getReferralBonusLimit(refs.count);
    const total_limit = BASE_LIMIT + bonus_limit;
    const watched     = todayAds?.count ?? 0;
    const remaining   = Math.max(total_limit - watched, 0);
    const todayEarned = parseFloat(String(todayAds?.todayEarned ?? "0")).toFixed(2);
    const balance     = parseFloat(String(dbUser.balance)).toFixed(2);
    return { bonus_limit, total_limit, watched, remaining, todayEarned, balance };
  }

  function buildEarnKeyboard(lang: Lang, remaining: number, watched: number, total_limit: number): Keyboard {
    const kbd = new Keyboard();
    if (remaining > 0) {
      kbd.add({ text: `${tr_(lang, "watchAdNowBtn")} (${watched}/${total_limit})`, style: "success" }).row();
    }
    kbd
      .add({ text: tr_(lang, "upgradeLimitBtn"), style: "primary" }).row()
      .add({ text: tr_(lang, "backToMainBtn"), style: "danger" })
      .resized();
    return kbd;
  }

  async function handleEarnPanel(ctx: BotCtx, lang: Lang, dbUser: NonNullable<FullUser>) {
    const d = await buildEarnData(dbUser);
    const msg = d.remaining > 0
      ? tr_(lang, "earnMsg",  { bonus_limit: d.bonus_limit, total_limit: d.total_limit, remaining: d.remaining })
      : tr_(lang, "earnDone", { balance: d.balance, max: d.total_limit });
    await showPanel(ctx, msg, { reply_markup: buildEarnKeyboard(lang, d.remaining, d.watched, d.total_limit) });
  }

  async function handleEarnPanelEdit(ctx: BotCtx, lang: Lang, dbUser: NonNullable<FullUser>) {
    const d = await buildEarnData(dbUser);
    const msg = d.remaining > 0
      ? tr_(lang, "earnMsg",  { bonus_limit: d.bonus_limit, total_limit: d.total_limit, remaining: d.remaining })
      : tr_(lang, "earnDone", { balance: d.balance, max: d.total_limit });
    await ctx.editMessageText(msg, HTML).catch(() => {});
  }

  async function buildTaskPanelData(dbUser: NonNullable<FullUser>, lang: Lang, tgUserId: number) {
    const [task, todayAds, adsThreshold, dailyBonus, referralReward, channels] = await Promise.all([
      getOrCreateDailyTask(dbUser.id),
      getTodayAds(dbUser.id),
      getNumSetting("ads_task_threshold", 5),
      getNumSetting("daily_bonus", 0.20),
      getNumSetting("referral_reward", 0.05),
      getActiveChannels(),
    ]);

    const adsWatched = todayAds?.count ?? 0;
    const taskObj = { ...task, adsDone: task.adsDone || adsWatched >= adsThreshold };
    const shareReward = (dailyBonus * 0.25).toFixed(2);
    const adsReward   = (dailyBonus * 0.25).toFixed(2);
    const chanReward  = channels.length > 0 ? (dailyBonus * 0.25 / channels.length).toFixed(2) : "0.05";
    const done = tr_(lang, "taskDonePrefix");
    const pend = tr_(lang, "taskPendingPrefix");
    const lines: string[] = [];

    lines.push(`${taskObj.adsDone ? done : pend}${tr_(lang, "taskWatchAds", { threshold: adsThreshold, reward: adsReward })}`);
    lines.push(`${taskObj.shareDone ? done : pend}${tr_(lang, "taskShare", { reward: shareReward })}`);

    const channelJoins: boolean[] = [];
    for (const ch of channels) {
      const joined = await getChannelJoin(dbUser.id, ch.id);
      channelJoins.push(!!joined?.rewardPaid);
      lines.push(`${channelJoins.at(-1) ? done : pend}${tr_(lang, "taskChannel", { name: ch.name, reward: chanReward })}`);
    }
    lines.push(`${taskObj.referralDone ? done : pend}${tr_(lang, "taskReferral", { reward: referralReward.toFixed(2) })}`);

    const totalTasks = 2 + channels.length + 1;
    let doneCount = [taskObj.adsDone, taskObj.shareDone, taskObj.referralDone].filter(Boolean).length
      + channelJoins.filter(Boolean).length;

    const msg = tr_(lang, "dailyTaskMsg", {
      tasks: lines.join("\n"), done: doneCount, total: totalTasks, bonus: dailyBonus.toFixed(2),
    });

    const kbd = new InlineKeyboard();
    if (!taskObj.shareDone) {
      const link = dbUser.referralCode ? getReferralLink(dbUser.referralCode) : "";
      if (link && !link.startsWith("⚠️"))
        kbd.add({ text: tr_(lang, "taskShareBtn"), url: `https://t.me/share/url?url=${encodeURIComponent(link)}`, style: "primary" }).row();
      kbd.add({ text: tr_(lang, "taskVerifyBtn") + " ✓ Share", callback_data: "task_share", style: "success" }).row();
    }
    for (let i = 0; i < channels.length; i++) {
      if (!channelJoins[i]) {
        const ch = channels[i]!;
        kbd.add({ text: `📢 ${ch.name}`, url: ch.url, style: "primary" }).row();
        kbd.add({ text: `${tr_(lang, "taskVerifyBtn")} — ${ch.name}`, callback_data: `task_channel:${ch.id}`, style: "success" }).row();
      }
    }
    if (doneCount >= totalTasks && !taskObj.bonusClaimed)
      kbd.add({ text: tr_(lang, "claimBonus"), callback_data: "task_claim", style: "success" });

    return { msg, kbd };
  }

  async function handleTaskPanel(ctx: BotCtx, lang: Lang, dbUser: NonNullable<FullUser>) {
    const tgUserId = ctx.from?.id ?? 0;
    const { msg, kbd } = await buildTaskPanelData(dbUser, lang, tgUserId);
    kbd.row().add({ text: "🔄 Refresh", callback_data: "refresh_tasks", style: "primary" });
    kbd.row().add({ text: "🏠 " + tr_(lang, "mainMenuBtn").replace(/^🏠\s*/, ""), callback_data: "go_main", style: "danger" });
    await showPanel(ctx, msg, { reply_markup: kbd });
  }

  async function handleTaskPanelEdit(ctx: BotCtx, lang: Lang, dbUser: NonNullable<FullUser>) {
    const tgUserId = ctx.from?.id ?? 0;
    const { msg, kbd } = await buildTaskPanelData(dbUser, lang, tgUserId);
    kbd.row().add({ text: "🔄 Refresh", callback_data: "refresh_tasks", style: "primary" });
    kbd.row().add({ text: "🏠 " + tr_(lang, "mainMenuBtn").replace(/^🏠\s*/, ""), callback_data: "go_main", style: "danger" });
    await ctx.editMessageText(msg, { ...HTML, reply_markup: kbd }).catch(() => {});
  }

  async function handleReferralPanel(ctx: BotCtx, lang: Lang, dbUser: NonNullable<FullUser>) {
    const [refReward, stats] = await Promise.all([
      getNumSetting("referral_reward", 0.05),
      getReferralStats(dbUser.id),
    ]);
    const link = dbUser.referralCode ? getReferralLink(dbUser.referralCode) : "N/A";
    const shareText = encodeURIComponent("💰 Join & earn real money watching ads!");
    const inlineKbd = new InlineKeyboard()
      .add({ text: tr_(lang, "shareLink"), url: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${shareText}`, style: "success" });

    inlineKbd.row()
      .add({ text: "🏠 " + tr_(lang, "mainMenuBtn").replace(/^🏠\s*/, ""), callback_data: "go_main", style: "danger" });

    await showPanel(ctx, tr_(lang, "referralMsg", {
      refReward: refReward.toFixed(2), count: stats.count, earned: stats.earned.toFixed(2), link,
    }), { reply_markup: inlineKbd });
  }

  // ─── /start ────────────────────────────────────────────────────────────────

  bot.command("start", async (ctx) => {
    const from    = ctx.from!;
    const refCode = ctx.match?.startsWith("ref_") ? ctx.match.slice(4) : undefined;
    const { user: dbUser, isNew } = await getOrCreateUser(
      String(from.id), from.first_name, from.last_name ?? null, from.username ?? null, refCode,
    );
    const lang   = (dbUser.language as Lang) ?? "en";
    const chatId = ctx.chat.id;
    const tgId   = String(from.id);

    clearState(ctx);
    // Only replace the language picker if it's already showing (avoid deleting main menu on re-/start)
    if (ctx.session.panelType === "welcome" && ctx.session.panelMsgId) {
      await ctx.api.deleteMessage(chatId, ctx.session.panelMsgId).catch(() => {});
      ctx.session.panelMsgId = undefined;
    }
    await ctx.deleteMessage().catch(() => {}); // remove the user's /start command

    if (!isNew) {
      // Returning user — straight to Main Menu in their saved language.
      // Language can only be changed afterwards via Settings.
      await showMainMenuPanel(ctx, lang, dbUser);
      return;
    }

    const sent = await ctx.api.sendMessage(chatId, tr_(lang, "welcome", { name: from.first_name }), {
      ...HTML, reply_markup: langKeyboard(),
    });
    ctx.session.panelMsgId = sent.message_id;
    ctx.session.panelType  = "welcome";
    await saveUserPanelMsg(tgId, sent.message_id).catch(() => {});
  });

  // ─── Language select (inline callback) ────────────────────────────────────

  bot.callbackQuery(/^lang:(.+)$/, async (ctx) => {
    const lang = ctx.match![1] as Lang;
    const tgId = String(ctx.from.id);
    await setUserLanguage(tgId, lang);
    await ctx.answerCallbackQuery();
    clearState(ctx);
    // Do NOT delete the language picker — showMainMenuPanel will replace it
    // only if panelType already is "main", otherwise both messages coexist cleanly
    const dbUser = await getUserByTelegramId(tgId);
    if (dbUser) await showMainMenuPanel(ctx, lang, dbUser);
  });

  // ─── Text handler ─────────────────────────────────────────────────────────
  // All reply keyboard navigation + text input states live here.

  bot.on("message:text", async (ctx) => {
    const tgId = String(ctx.from.id);
    const text = ctx.message.text.trim();

    let dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) { await ctx.reply(tr_("en", "startFirst"), HTML); return; }
    const lang = (dbUser.language as Lang) ?? "en";

    if (dbUser.isBanned) {
      await showPanel(ctx, tr_(lang, "banned"), { reply_markup: mainMenu(lang) });
      return;
    }

    const suspendedUntil = await getSuspension(dbUser.id);
    if (suspendedUntil) {
      const mins = Math.max(1, Math.ceil((suspendedUntil.getTime() - Date.now()) / 60000));
      await showPanel(ctx, `⏳ <b>Temporarily Suspended</b>\n<code>${SEP}</code>\nToo many abandoned ads. Try again in ~${mins} min.`, { reply_markup: mainMenu(lang) });
      return;
    }

    // ── Global shortcuts: Cancel / Main Menu ─────────────────────────────

    if (text === tr_(lang, "cancelBtn") || text === tr_(lang, "mainMenuBtn")) {
      clearState(ctx);
      dbUser = (await getUserByTelegramId(tgId))!;
      await showMainMenuPanel(ctx, lang, dbUser);
      return;
    }

    // ══════════════════════════════════════════════════════════════════════
    //  STATE MACHINE
    // ══════════════════════════════════════════════════════════════════════

    // ── await_wallet_address: user typing wallet number ───────────────────

    if (ctx.session.state === "await_wallet_address") {
      const method  = ctx.session.walletMethod!;
      if (!isValidWalletInput(method, text)) {
        await deleteIncomingMessage(ctx);
        await editPanel(ctx, walletInputInvalid(lang, method), {
          reply_markup: inlineCancelMenu(lang),
        });
        return;
      }
      clearState(ctx);
      await updateUserWallet(tgId, method, text);
      await deleteIncomingMessage(ctx);
      await editPanel(ctx, tr_(lang, "walletSavedMsg", {
        method: getMethodLabel(method),
        address: previewWalletAddress(text),
      }), { reply_markup: walletSavedMenu(lang) });
      return;
    }

    // ── await_withdraw_address: user typing withdrawal address ────────────

    if (ctx.session.state === "await_withdraw_address") {
      const method  = ctx.session.withdrawMethod!;
      if (!isValidWalletInput(method, text)) {
        await deleteIncomingMessage(ctx);
        await editPanel(ctx, walletInputInvalid(lang, method), {
          reply_markup: inlineCancelMenu(lang),
        });
        return;
      }
      ctx.session.pendingAddress = text;
      ctx.session.state = "await_withdraw_confirm";
      dbUser = (await getUserByTelegramId(tgId))!;
      const balance = Number(dbUser.balance).toFixed(2);
      await deleteIncomingMessage(ctx);
      await editPanel(ctx,
        tr_(lang, "confirmWdMsg", { method: getMethodLabel(method), address: text, balance }),
        { reply_markup: inlineConfirmMenu(lang) }
      );
      return;
    }

    // ── await_withdraw_confirm: Confirm / Change Method ───────────────────

    if (ctx.session.state === "await_withdraw_confirm") {
      if (text === tr_(lang, "confirmBtn")) {
        const method  = ctx.session.withdrawMethod!;
        const address = ctx.session.pendingAddress!;
        clearState(ctx);
        dbUser = (await getUserByTelegramId(tgId))!;
        const balance = Number(dbUser.balance);
        const minWd   = await getNumSetting("min_withdrawal", 0.50);
        if (balance < minWd) {
          await editPanel(ctx, tr_(lang, "withdrawLow", {
            balance: balance.toFixed(2),
            minWd: minWd.toFixed(2),
          }), { reply_markup: walletOverviewKeyboard(lang) });
          return;
        }
        const result = await createWithdrawal(dbUser.id, balance, method, address);
        if (result.ok) {
          await editPanel(ctx, tr_(lang, "withdrawConfirm", {
            amount: balance.toFixed(2),
            method: getMethodLabel(method),
            address,
          }), { reply_markup: walletOverviewKeyboard(lang) });
        } else if (result.reason === "pending") {
          await editPanel(ctx, tr_(lang, "withdrawPending"), {
            reply_markup: walletOverviewKeyboard(lang),
          });
        } else {
          await editPanel(ctx, tr_(lang, "withdrawLow", {
            balance: balance.toFixed(2),
            minWd: minWd.toFixed(2),
          }), { reply_markup: walletOverviewKeyboard(lang) });
        }
        return;
      }
      if (text === tr_(lang, "changeMethodBtn")) {
        ctx.session.state          = "selecting_withdraw_method";
        ctx.session.pendingAddress = undefined;
        dbUser = (await getUserByTelegramId(tgId))!;
        const balance = Number(dbUser.balance);
        const minWd   = await getNumSetting("min_withdrawal", 0.50);
        await editPanel(ctx, tr_(lang, "withdrawMsg", {
          balance: balance.toFixed(2),
          minWd: minWd.toFixed(2),
        }), { reply_markup: withdrawMethodInlineMenu(lang) });
        return;
      }
      return; // ignore other input while confirming
    }

    // ── await_name_update: user typing new name ────────────────────────────

    if (ctx.session.state === "await_name_update") {
      const newName = text.slice(0, 64);
      clearState(ctx);
      await updateUserName(tgId, newName);
      await showPanel(ctx, tr_(lang, "nameUpdated", { name: newName }), { reply_markup: profileSubMenu(lang) });
      return;
    }

    // ══════════════════════════════════════════════════════════════════════
    //  PAYMENT METHOD BUTTON DETECTION
    //  (same button text used in both wallet-select and withdraw-method menus)
    // ══════════════════════════════════════════════════════════════════════

    const methodId = getMethodIdFromBtnText(text);
    if (methodId) {
      const isWithdrawFlow = ctx.session.state === "selecting_withdraw_method";
      const isWalletFlow   = ctx.session.state === "selecting_wallet_method";

      if (isWithdrawFlow) {
        ctx.session.withdrawMethod = methodId;
        ctx.session.state          = "await_withdraw_address";
        await editPanel(ctx,
          walletInputPrompt(lang, methodId),
          { reply_markup: inlineCancelMenu(lang) }
        );
        return;
      }

      if (isWalletFlow || ctx.session.state === undefined) {
        // Default to wallet save flow (from profile → set wallet)
        ctx.session.walletMethod = methodId;
        ctx.session.state        = "await_wallet_address";
        await editPanel(ctx,
          walletInputPrompt(lang, methodId),
          { reply_markup: inlineCancelMenu(lang) }
        );
        return;
      }
    }

    // ══════════════════════════════════════════════════════════════════════
    //  MAIN MENU NAVIGATION
    // ══════════════════════════════════════════════════════════════════════

    // ── 👁 Watch Ads & Earn ───────────────────────────────────────────────

    if (text === tr_(lang, "watchAdsEarnBtn")) {
      clearState(ctx);
      dbUser = (await getUserByTelegramId(tgId))!;
      await handleEarnPanel(ctx, lang, dbUser);
      return;
    }

    // ── 💳 Wallet ─────────────────────────────────────────────────────────

    if (text === tr_(lang, "walletBtn")) {
      await deleteIncomingMessage(ctx);
      await handleWalletOverview(ctx, lang, dbUser);
      return;
    }

    // ── 👤 Dashboard ──────────────────────────────────────────────────────

    if (text === tr_(lang, "dashboardBtn")) {
      clearState(ctx);
      dbUser = (await getUserByTelegramId(tgId))!;
      await handleProfilePanel(ctx, lang, dbUser);
      return;
    }

    // ── 👥 Referrals ──────────────────────────────────────────────────────

    if (text === tr_(lang, "referralsBtn")) {
      clearState(ctx);
      await handleReferralPanel(ctx, lang, dbUser);
      return;
    }

    // ── 🎁 Rewards ────────────────────────────────────────────────────────

    if (text === tr_(lang, "rewardsBtn")) {
      clearState(ctx);
      dbUser = (await getUserByTelegramId(tgId))!;
      await handleTaskPanel(ctx, lang, dbUser);
      return;
    }

    // ── 🎬 Video Zone ─────────────────────────────────────────────────────

    if (text === tr_(lang, "videoZoneBtn")) {
      clearState(ctx);
      await handleVideoZonePanel(ctx, lang);
      return;
    }

    // ── 📢 Channel ────────────────────────────────────────────────────────

    if (text === tr_(lang, "channelBtn")) {
      clearState(ctx);
      dbUser = (await getUserByTelegramId(tgId))!;
      await handleChannelPanel(ctx, lang, dbUser);
      return;
    }

    // ── ⚙️ Settings ───────────────────────────────────────────────────────

    if (text === tr_(lang, "settingsBtn")) {
      clearState(ctx);
      await handleSettingsPanel(ctx, lang);
      return;
    }

    // ── ✏️ Change Name (Settings / Dashboard reply keyboard button) ─────────
    // Wallet/withdraw/name-change stay on an Inline "Cancel" keyboard once
    // the bot is waiting for typed input — only the menu button itself is
    // Reply Keyboard.

    if (text === tr_(lang, "changeNameBtn")) {
      ctx.session.state = "await_name_update";
      await showPanel(ctx, tr_(lang, "enterNameMsg"), { reply_markup: cancelMenu(lang) });
      return;
    }

    // ── 🌐 Change Language (Settings / Dashboard reply keyboard button) ─────

    if (text === tr_(lang, "changeLangBtn")) {
      clearState(ctx);
      await showPanel(ctx, tr_(lang, "selectLang"), { reply_markup: langKeyboard() });
      return;
    }

    // ── 💳 Set Wallet (Dashboard reply keyboard button) ──────────────────────

    if (text === tr_(lang, "setWalletBtn")) {
      await handleWalletSetPrompt(ctx, lang);
      return;
    }

    // ── 💸 Withdrawal (Dashboard reply keyboard button) ──────────────────────

    if (text === tr_(lang, "withdrawalBtn")) {
      dbUser = (await getUserByTelegramId(tgId))!;
      await handleWithdrawalPrompt(ctx, lang, dbUser);
      return;
    }

    // ── 🌐 Language picked (reply keyboard button on the language screen) ───

    {
      const picked = LANG_BUTTONS.find(b => b.text === text);
      if (picked) {
        await setUserLanguage(tgId, picked.code);
        clearState(ctx);
        const freshUser = (await getUserByTelegramId(tgId))!;
        await showMainMenuPanel(ctx, picked.code, freshUser);
        return;
      }
    }

    // ── 💬 Support ────────────────────────────────────────────────────────────

    if (text === tr_(lang, "supportBtn")) {
      clearState(ctx);
      const kbd = new Keyboard()
        .add({ text: tr_(lang, "mainMenuBtn"), style: "danger" })
        .resized();
      await showPanel(ctx, tr_(lang, "supportMsg"), { reply_markup: kbd });
      return;
    }

    // ── ⬅️ Back (from wallet select → main menu) ──────────────────────────

    if (text === tr_(lang, "backBtn")) {
      clearState(ctx);
      dbUser = (await getUserByTelegramId(tgId))!;
      await showMainMenuPanel(ctx, lang, dbUser);
      return;
    }

    // ── 🎬 Watch Ad Now (earn sub-menu reply keyboard button) ────────────────

    if (text.startsWith(tr_(lang, "watchAdNowBtn"))) {
      clearState(ctx);
      await requireForceJoin(ctx, lang, dbUser, "watch_ad", async () => {
        const channels = await getActiveChannels();
        if (channels.length > 0) {
          const unjoined = await getUnjoinedChannels(dbUser.id, ctx.from.id, channels);
          if (unjoined.length > 0) {
            const channelList = unjoined.map(c => `  • <a href="${c.url}">${c.name}</a>`).join("\n");
            const kbd = new InlineKeyboard();
            for (const c of unjoined) kbd.add({ text: `📢 ${c.name}`, url: c.url, style: "primary" }).row();
            kbd.add({ text: tr_(lang, "joinedVerify"), callback_data: "verify_channels", style: "success" });
            await showPanel(ctx, tr_(lang, "channelRequired", { channels: channelList }), { reply_markup: kbd });
            return;
          }
        }
        const result = await startAdWatch(dbUser.id);
        if (!result.ok) {
          const errMsg = result.alreadyPending
            ? tr_(lang, "adAlreadyPending")
            : tr_(lang, "adsLimit", { max: 25, balance: Number(dbUser.balance).toFixed(2) });
          await showPanel(ctx, errMsg, {});
          return;
        }
        const adKbd = new InlineKeyboard()
          .add({ text: tr_(lang, "watchNow"), url: ADS_URL, style: "primary" }).row()
          .add({ text: tr_(lang, "adVerify"), callback_data: `ad_done:${result.token}`, style: "success" });
        await showPanel(ctx, tr_(lang, "adStarted"), { reply_markup: adKbd });
      });
      return;
    }

    // ── 🚀 Upgrade Daily Limit (earn sub-menu reply keyboard button) ─────────

    if (text === tr_(lang, "upgradeLimitBtn")) {
      clearState(ctx);
      await handleReferralPanel(ctx, lang, dbUser);
      return;
    }

    // ── 🔙 Back to Main Menu (earn sub-menu reply keyboard button) ───────────

    if (text === tr_(lang, "backToMainBtn")) {
      clearState(ctx);
      dbUser = (await getUserByTelegramId(tgId))!;
      await showMainMenuPanel(ctx, lang, dbUser);
      return;
    }

    // Unknown text — silently ignore (do not reply to random messages)
    return;
  });

  // ─── Watch ad (inline callback) ───────────────────────────────────────────

  bot.callbackQuery("watch_ad", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser || dbUser.isBanned) return;
    const lang = (dbUser.language as Lang) ?? "en";

    await requireForceJoin(ctx, lang, dbUser, "watch_ad", async () => {
      const channels = await getActiveChannels();
      if (channels.length > 0) {
        const unjoined = await getUnjoinedChannels(dbUser.id, ctx.from.id, channels);
        if (unjoined.length > 0) {
          const channelList = unjoined.map(c => `  • <a href="${c.url}">${c.name}</a>`).join("\n");
          const kbd = new InlineKeyboard();
          for (const c of unjoined) kbd.add({ text: `📢 ${c.name}`, url: c.url, style: "primary" }).row();
          kbd.add({ text: tr_(lang, "joinedVerify"), callback_data: "verify_channels", style: "success" });
          await ctx.editMessageText(tr_(lang, "channelRequired", { channels: channelList }), { ...HTML, reply_markup: kbd });
          return;
        }
      }

      const result = await startAdWatch(dbUser.id);
      if (!result.ok) {
        const msg = result.alreadyPending
          ? tr_(lang, "adAlreadyPending")
          : tr_(lang, "adsLimit", { max: await getNumSetting("max_ads_per_day", 10), balance: Number(dbUser.balance).toFixed(2) });
        await ctx.editMessageText(msg, HTML);
        return;
      }

      const kbd = new InlineKeyboard()
        .add({ text: tr_(lang, "watchNow"), url: ADS_URL, style: "primary" }).row()
        .add({ text: tr_(lang, "adVerify"), callback_data: `ad_done:${result.token}`, style: "success" });
      await ctx.editMessageText(tr_(lang, "adStarted"), { ...HTML, reply_markup: kbd });
    });
  });

  // ─── Ad complete ──────────────────────────────────────────────────────────

  bot.callbackQuery(/^ad_done:(.+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();           // answer immediately — prevents keyboard pop
    const token  = ctx.match![1]!;
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";

    const result = await completeAdWatch(dbUser.id, token);
    if (result.banned) {
      await ctx.editMessageText(tr_(lang, "adCheatBan"), HTML);
      return;
    }
    if (result.cheated) {
      const [warnCount, warnLimit] = await Promise.all([getWarningCount(dbUser.id), getNumSetting("warn_limit", 3)]);
      await ctx.editMessageText(tr_(lang, "adFailed", { warnCount, warnLimit }), HTML);
      return;
    }
    if (!result.ok) return;

    const [maxAds, adReward] = await Promise.all([getNumSetting("max_ads_per_day", 10), getNumSetting("ad_reward", 0.01)]);

    const balance   = parseFloat(result.balance ?? "0").toFixed(2);
    const watched   = result.watched ?? 0;
    const remaining = maxAds - watched;
    await ctx.editMessageText(tr_(lang, "adComplete", { balance, watched, max: maxAds }), HTML).catch(() => {});
  });

  // ─── Refresh balance ──────────────────────────────────────────────────────

  bot.callbackQuery("refresh_balance", async (ctx) => {
    await ctx.answerCallbackQuery("🔄 Refreshed!");
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    await handleEarnPanelEdit(ctx, lang, dbUser);
  });

  bot.callbackQuery("refresh_wallet", async (ctx) => {
    await ctx.answerCallbackQuery("🔄 Refreshed!");
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    await handleWalletOverview(ctx, lang, dbUser);
  });

  bot.callbackQuery("refresh_tasks", async (ctx) => {
    await ctx.answerCallbackQuery("🔄 Refreshed!");
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    await handleTaskPanelEdit(ctx, lang, dbUser);
  });

  // ─── Verify channels ──────────────────────────────────────────────────────

  bot.callbackQuery("force_join_verify", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang     = (dbUser.language as Lang) ?? "en";
    const required = await getRequiredChannels();
    const missing: typeof required = [];
    for (const ch of required) {
      if (!await checkChannelMembershipByTgId(ch.telegramId, ctx.from.id)) missing.push(ch);
    }
    if (missing.length > 0) {
      const kbd = new InlineKeyboard();
      missing.forEach((ch) => kbd.url(`📢 ${ch.name}`, ch.url).row());
      kbd.add({ text: "✅ I've Joined — Verify", callback_data: "force_join_verify", style: "success" });
      await ctx.editMessageText(
        `🔒 <b>Join Required</b>\n<code>${SEP}</code>\nStill missing — join and tap Verify again:`,
        { ...HTML, reply_markup: kbd },
      );
      return;
    }
    await completeReferralIfPending(dbUser.id).catch(() => null);
    const action = ctx.session.pendingForceJoinAction;
    ctx.session.pendingForceJoinAction = undefined;
    const freshUser = (await getUserByTelegramId(tgId))!;
    if (action === "withdraw")      await handleWithdrawalPrompt(ctx, lang, freshUser);
    else if (action === "claim_bonus") await handleTaskPanelEdit(ctx, lang, freshUser);
    else                             await handleEarnPanelEdit(ctx, lang, freshUser); // "watch_ad" or unknown — safest default
  });

  bot.callbackQuery("verify_channels", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    const channels     = await getActiveChannels();
    const stillUnjoined = await getUnjoinedChannels(dbUser.id, ctx.from.id, channels);
    if (stillUnjoined.length > 0) {
      const channelList = stillUnjoined.map(c => `  • <a href="${c.url}">${c.name}</a>`).join("\n");
      const kbd = new InlineKeyboard();
      for (const c of stillUnjoined) kbd.add({ text: `📢 ${c.name}`, url: c.url, style: "primary" }).row();
      kbd.add({ text: tr_(lang, "joinedVerify"), callback_data: "verify_channels", style: "success" });
      await ctx.editMessageText(tr_(lang, "channelRequired", { channels: channelList }), { ...HTML, reply_markup: kbd });
      return;
    }
    for (const ch of channels) {
      const join = await getChannelJoin(dbUser.id, ch.id);
      if (!join?.rewardPaid) await recordChannelJoin(dbUser.id, ch.id);
    }
    const freshUser = await getUserByTelegramId(tgId);
    if (freshUser) await handleEarnPanelEdit(ctx, lang, freshUser);
  });

  // ─── Task: channel verify ─────────────────────────────────────────────────

  bot.callbackQuery(/^task_channel:(\d+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();           // answer immediately — prevents keyboard pop
    const channelId = parseInt(ctx.match![1]!);
    const tgId      = String(ctx.from.id);
    const dbUser    = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    const isMember = await checkChannelMembership(channelId, ctx.from.id);
    if (!isMember) { await ctx.answerCallbackQuery("❌ " + tr_(lang, "channelNotJoined")); return; }
    const result = await recordChannelJoin(dbUser.id, channelId);
    const freshUser = await getUserByTelegramId(tgId);
    if (freshUser) await handleTaskPanelEdit(ctx, lang, freshUser);
  });

  // ─── Task: share ──────────────────────────────────────────────────────────

  bot.callbackQuery("task_share", async (ctx) => {
    await ctx.answerCallbackQuery("✅ Share confirmed!");
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    await markTaskShare(dbUser.id);
    const freshUser = await getUserByTelegramId(tgId);
    if (freshUser) await handleTaskPanelEdit(ctx, lang, freshUser);
  });

  // ─── Task: claim bonus ────────────────────────────────────────────────────

  bot.callbackQuery("task_claim", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang   = (dbUser.language as Lang) ?? "en";
    await requireForceJoin(ctx, lang, dbUser, "claim_bonus", async () => {
      const result = await claimDailyBonus(dbUser.id);
      if (result.ok) {
        const bonus = await getNumSetting("daily_bonus", 0.20);
        const navKbd = new InlineKeyboard()
          .add({ text: "👀 " + tr_(lang, "watchAdsBtn").replace(/^👀\s*/, ""), callback_data: "go_earn", style: "success" })
          .add({ text: "🏠 " + tr_(lang, "mainMenuBtn").replace(/^🏠\s*/, ""), callback_data: "go_main", style: "danger"  });
        await ctx.editMessageText(tr_(lang, "bonusClaimed", {
          bonus: bonus.toFixed(2),
          balance: parseFloat(result.balance ?? "0").toFixed(2),
        }), { ...HTML, reply_markup: navKbd });
      } else if (result.reason === "alreadyClaimed") {
        await ctx.answerCallbackQuery(tr_(lang, "alreadyClaimed"));
      } else {
        await ctx.answerCallbackQuery(tr_(lang, "tasksNotComplete"));
      }
    });
  });


  // ─── Inline nav callbacks ────────────────────────────────────────────────────

  bot.callbackQuery("go_main", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    clearState(ctx);
    await showMainMenuPanel(ctx, lang, dbUser);
  });


  bot.callbackQuery("go_earn", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    clearState(ctx);
    await handleEarnPanel(ctx, lang, dbUser);
  });

  bot.callbackQuery("go_tasks", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    clearState(ctx);
    await handleTaskPanel(ctx, lang, dbUser);
  });

  bot.callbackQuery("go_wallet", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from.id);
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    await handleWalletOverview(ctx, lang, dbUser);
  });

  bot.callbackQuery("wallet_overview", async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const dbUser = await getUserByTelegramId(String(ctx.from?.id ?? ""));
    if (!dbUser) return;
    await handleWalletOverview(ctx, (dbUser.language as Lang) ?? "en", dbUser);
  });

  bot.callbackQuery("wallet_request", async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const dbUser = await getUserByTelegramId(String(ctx.from?.id ?? ""));
    if (!dbUser) return;
    await handleWithdrawalPrompt(ctx, (dbUser.language as Lang) ?? "en", dbUser);
  });

  bot.callbackQuery("wallet_set", async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const dbUser = await getUserByTelegramId(String(ctx.from?.id ?? ""));
    if (!dbUser) return;
    await handleWalletSetPrompt(ctx, (dbUser.language as Lang) ?? "en");
  });

  bot.callbackQuery("wallet_history", async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const dbUser = await getUserByTelegramId(String(ctx.from?.id ?? ""));
    if (!dbUser) return;
    await handleWalletHistory(ctx, (dbUser.language as Lang) ?? "en", dbUser);
  });

  bot.callbackQuery("wallet_proofs", async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const dbUser = await getUserByTelegramId(String(ctx.from?.id ?? ""));
    if (!dbUser) return;
    await handleWalletHistory(ctx, (dbUser.language as Lang) ?? "en", dbUser, true);
  });

  bot.callbackQuery(/^wallet_method:(.+)$/, async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const dbUser = await getUserByTelegramId(String(ctx.from?.id ?? ""));
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    const method = ctx.match![1]!;
    if (!WITHDRAW_METHODS.some(item => item.id === method)) return;
    ctx.session.walletMethod = method;
    ctx.session.state = "await_wallet_address";
    await editPanel(ctx, walletInputPrompt(lang, method), {
      reply_markup: inlineCancelMenu(lang),
    });
  });

  bot.callbackQuery(/^wd_method:(.+)$/, async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const dbUser = await getUserByTelegramId(String(ctx.from?.id ?? ""));
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    const method = ctx.match![1]!;
    if (!WITHDRAW_METHODS.some(item => item.id === method)) return;
    ctx.session.withdrawMethod = method;
    ctx.session.state = "await_withdraw_address";
    await editPanel(ctx, walletInputPrompt(lang, method), {
      reply_markup: inlineCancelMenu(lang),
    });
  });

  bot.callbackQuery("wallet_change", async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const dbUser = await getUserByTelegramId(String(ctx.from?.id ?? ""));
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    if (ctx.session.state === "await_withdraw_confirm") {
      ctx.session.state = "selecting_withdraw_method";
      await handleWithdrawalPrompt(ctx, lang, dbUser);
    } else {
      ctx.session.state = "selecting_wallet_method";
      await handleWalletSetPrompt(ctx, lang);
    }
  });

  bot.callbackQuery("wallet_confirm", async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const tgId = String(ctx.from?.id ?? "");
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";

    if (ctx.session.state === "await_withdraw_confirm") {
      const method = ctx.session.withdrawMethod!;
      const address = ctx.session.pendingAddress!;
      clearState(ctx);
      const freshUser = await getUserByTelegramId(tgId);
      if (!freshUser) return;
      const balance = Number(freshUser.balance);
      const minWd = await getNumSetting("min_withdrawal", 0.50);
      if (balance < minWd) {
        await editPanel(ctx, tr_(lang, "withdrawLow", {
          balance: balance.toFixed(2),
          minWd: minWd.toFixed(2),
        }), { reply_markup: walletOverviewKeyboard(lang) });
        return;
      }
      const result = await createWithdrawal(freshUser.id, balance, method, address);
      if (result.ok) {
        await editPanel(ctx, tr_(lang, "withdrawConfirm", {
          amount: balance.toFixed(2),
          method: getMethodLabel(method),
          address,
        }), { reply_markup: walletOverviewKeyboard(lang) });
      } else if (result.reason === "pending") {
        await editPanel(ctx, tr_(lang, "withdrawPending"), {
          reply_markup: walletOverviewKeyboard(lang),
        });
      } else {
        await editPanel(ctx, tr_(lang, "withdrawLow", {
          balance: balance.toFixed(2),
          minWd: minWd.toFixed(2),
        }), { reply_markup: walletOverviewKeyboard(lang) });
      }
    }
  });

  bot.callbackQuery("go_dashboard", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from?.id ?? "");
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    clearState(ctx);
    await handleProfilePanel(ctx, lang, dbUser);
  });

  bot.callbackQuery("go_video", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from?.id ?? "");
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    clearState(ctx);
    await handleVideoZonePanel(ctx, lang);
  });

  bot.callbackQuery("go_referral", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from?.id ?? "");
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    clearState(ctx);
    await handleReferralPanel(ctx, lang, dbUser);
  });

  bot.callbackQuery("go_channel", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from?.id ?? "");
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    clearState(ctx);
    await handleChannelPanel(ctx, lang, dbUser);
  });

  bot.callbackQuery("go_settings", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from?.id ?? "");
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    clearState(ctx);
    await handleSettingsPanel(ctx, lang);
  });

  bot.callbackQuery("go_support", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from?.id ?? "");
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    const kbd = new InlineKeyboard()
      .add({ text: "🏠 Main Menu", callback_data: "go_main", style: "danger" });
    await showPanel(ctx, tr_(lang, "supportMsg"), { reply_markup: kbd });
  });

  // ─── Dashboard inline sub-menu callbacks ─────────────────────────────────────

  bot.callbackQuery("dash_name", async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from?.id ?? "");
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    ctx.session.state = "await_name_update";
    await showPanel(ctx, tr_(lang, "enterNameMsg"), { reply_markup: cancelMenu(lang) });
  });

  bot.callbackQuery("dash_lang", async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from?.id ?? "");
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    clearState(ctx);
    await showPanel(ctx, tr_(lang, "selectLang"), { reply_markup: langKeyboard() });
  });

  bot.callbackQuery("dash_wallet", async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from?.id ?? "");
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang = (dbUser.language as Lang) ?? "en";
    await handleWalletSetPrompt(ctx, lang);
  });

  bot.callbackQuery("dash_withdraw", async (ctx: BotCtx) => {
    await ctx.answerCallbackQuery();
    const tgId   = String(ctx.from?.id ?? "");
    const dbUser = await getUserByTelegramId(tgId);
    if (!dbUser) return;
    const lang    = (dbUser.language as Lang) ?? "en";
    await handleWithdrawalPrompt(ctx, lang, dbUser);
  });

  // ─── /help command ───────────────────────────────────────────────────────────

  bot.command("help", async (ctx) => {
    const tgId  = String(ctx.from?.id ?? "");
    const dbUser = tgId ? await getUserByTelegramId(tgId) : null;
    const lang   = (dbUser?.language as Lang) ?? "en";
    await ctx.reply(tr_(lang, "helpMsg"), HTML);
  });

  // ─── /stats command ───────────────────────────────────────────────────────────

  bot.command("stats", async (ctx) => {
    const tgId  = String(ctx.from?.id ?? "");
    const dbUser = tgId ? await getUserByTelegramId(tgId) : null;
    const lang   = (dbUser?.language as Lang) ?? "en";
    const stats  = await getBotStats();
    const msg    = tr_(lang, "statsMsg", {
      users:      stats.users.toLocaleString(),
      totalPaid:  stats.totalPaid,
      totalAds:   stats.totalAds.toLocaleString(),
      topEarner:  stats.topEarner,
    });
    await ctx.reply(msg, HTML);
  });

  // ─── /leaderboard command ─────────────────────────────────────────────────────

  bot.command("leaderboard", async (ctx) => {
    const tgId  = String(ctx.from?.id ?? "");
    const dbUser = tgId ? await getUserByTelegramId(tgId) : null;
    const lang   = (dbUser?.language as Lang) ?? "en";
    const top    = await getTopEarners(10);
    if (!top.length) {
      await ctx.reply(tr_(lang, "leaderboardEmpty"), HTML);
      return;
    }
    const medals = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
    const entries = top.map((u, i) => {
      const displayName = u.firstName.length > 16 ? u.firstName.slice(0, 16) + "…" : u.firstName;
      return tr_(lang, "leaderboardEntry", {
        medal:  medals[i] ?? `${i + 1}.`,
        rank:   i + 1,
        name:   displayName,
        earned: parseFloat(String(u.totalEarned)).toFixed(2),
      });
    }).join("\n");
    await ctx.reply(tr_(lang, "leaderboardTitle", { entries }), HTML);
  });

  // ─── /support command ─────────────────────────────────────────────────────────

  bot.command("support", async (ctx) => {
    const tgId  = String(ctx.from?.id ?? "");
    const dbUser = tgId ? await getUserByTelegramId(tgId) : null;
    const lang   = (dbUser?.language as Lang) ?? "en";
    await ctx.reply(tr_(lang, "supportMsg"), HTML);
  });

  // ─── /age command ─────────────────────────────────────────────────────────

  bot.command("age", async (ctx) => {
    const tgId  = String(ctx.from?.id ?? "");
    const dbUser = tgId ? await getUserByTelegramId(tgId) : null;
    const lang   = (dbUser?.language as Lang) ?? "en";

    const input = (ctx.match ?? "").trim();
    if (!input) {
      await ctx.reply(tr_(lang, "ageCmd"), HTML);
      return;
    }

    // Accept DD/MM/YYYY or DD-MM-YYYY
    const match = input.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (!match) {
      await ctx.reply(tr_(lang, "ageInvalid"), HTML);
      return;
    }

    const day   = parseInt(match[1]!, 10);
    const month = parseInt(match[2]!, 10);
    const year  = parseInt(match[3]!, 10);

    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear()) {
      await ctx.reply(tr_(lang, "ageInvalid"), HTML);
      return;
    }

    const birth = new Date(year, month - 1, day);
    if (isNaN(birth.getTime()) || birth > new Date()) {
      await ctx.reply(tr_(lang, "ageInvalid"), HTML);
      return;
    }

    const now = new Date();
    let years  = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth()    - birth.getMonth();
    let days   = now.getDate()     - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years  -= 1;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const dateStr   = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;

    const msg = tr_(lang, "ageResult", {
      date: dateStr,
      years,
      months,
      days,
      totalDays: totalDays.toLocaleString(),
    });

    await ctx.reply(msg, HTML);
  });

  // ─── Start: Webhook (production) or Long Polling (dev) ───────────────────

  const webhookUrl = process.env.WEBHOOK_URL;

  if (webhookUrl && expressApp) {
    // Webhook mode — much faster, used on Render/production
    const webhookPath = `/api/bot-webhook`;
    expressApp.use(webhookPath, webhookCallback(bot, "express"));
    await bot.api.setWebhook(`${webhookUrl}${webhookPath}`);
    logger.info({ username: BOT_USERNAME, webhookUrl: `${webhookUrl}${webhookPath}` }, "Bot started (webhook mode)");
  } else {
    // Long polling mode — used on Replit dev
    bot.start({
      onStart: (info) => logger.info({ username: info.username }, "Bot started (polling mode)"),
    }).catch((err) => logger.error({ err }, "Bot failed to start"));
  }

  return bot;
}
