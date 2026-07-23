import { pgTable, serial, integer, numeric, date, timestamp, text } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const adsWatchedTable = pgTable("ads_watched", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  watchDate: date("watch_date").notNull(),
  count: integer("count").notNull().default(0),
  todayEarned: numeric("today_earned", { precision: 10, scale: 4 }).notNull().default("0"),
  lastWatchedAt: timestamp("last_watched_at").notNull().defaultNow(),
  pendingAdStart: timestamp("pending_ad_start"),
  pendingAdToken: text("pending_ad_token"), // unique token per ad session, anti-forgery
});

export type AdsWatched = typeof adsWatchedTable.$inferSelect;
