import { pgTable, serial, integer, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const referralsTable = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  referredId: integer("referred_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 4 }).notNull().default("0.05"),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  // ─── Anti-fraud gating ──────────────────────────────────────────────────────
  // The one-time signup bonus (and milestone/daily-task credit) is only paid once
  // the referred user completes real activity — never on signup alone.
  firstActivityDone: boolean("first_activity_done").notNull().default(false),
  signupBonusPaid: boolean("signup_bonus_paid").notNull().default(false),
});

export type Referral = typeof referralsTable.$inferSelect;
