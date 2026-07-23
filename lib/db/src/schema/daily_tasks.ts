import { pgTable, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const dailyTasksTable = pgTable("daily_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  taskDate: date("task_date").notNull(),
  shareDone: boolean("share_done").notNull().default(false),
  channelDone: boolean("channel_done").notNull().default(false),
  adsDone: boolean("ads_done").notNull().default(false),
  referralDone: boolean("referral_done").notNull().default(false),
  bonusClaimed: boolean("bonus_claimed").notNull().default(false),
  claimedAt: timestamp("claimed_at"),
});

export type DailyTask = typeof dailyTasksTable.$inferSelect;
