import { pgTable, serial, text, boolean, numeric, integer, timestamp } from "drizzle-orm/pg-core";
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
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
