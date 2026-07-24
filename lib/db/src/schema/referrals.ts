import { pgTable, serial, integer, numeric, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const referralsTable = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  referredId: integer("referred_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 4 }).notNull().default("0.05"),
  status: text("status").notNull().default("pending"), // "pending" until referred user passes force-join, then "success"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Referral = typeof referralsTable.$inferSelect;
