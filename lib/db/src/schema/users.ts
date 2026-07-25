import { pgTable, serial, text, boolean, numeric, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  telegramId: text("telegram_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  username: text("username"),
  language: text("language").notNull().default("en"),
  balance: numeric("balance", { precision: 10, scale: 4 }).notNull().default("0"),
  totalEarned: numeric("total_earned", { precision: 10, scale: 4 }).notNull().default("0"),
  referralCode: text("referral_code").notNull().unique(),
  referredBy: integer("referred_by"),
  isBanned: boolean("is_banned").notNull().default(false),
  lastPanelMsgId: integer("last_panel_msg_id"), // track last bot panel for cleanup
  walletMethod: text("wallet_method"),          // saved withdrawal method (e.g. "bkash")
  walletAddress: text("wallet_address"),        // saved wallet address / number
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActive: timestamp("last_active").notNull().defaultNow(),

  // ─── Referral milestone system (Upgrade Daily Limit) ───────────────────────
  bonusAdsAmount: integer("bonus_ads_amount").notNull().default(0),     // extra ads/day from current milestone tier
  bonusAdsExpiresAt: timestamp("bonus_ads_expires_at"),                 // when the current tier's bonus ads expire
  claimedMilestones: text("claimed_milestones").notNull().default(""), // comma-separated referral counts already paid, e.g. "15,25"

  // ─── Temporary ban (anti-cheat escalation) ─────────────────────────────────
  bannedUntil: timestamp("banned_until"),        // if set and in the future, user is temporarily banned
  cheatCount: integer("cheat_count").notNull().default(0), // cheat attempts today (resets daily)
  cheatCountDate: date("cheat_count_date"),      // date the cheatCount belongs to
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
