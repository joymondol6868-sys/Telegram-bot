import { pgTable, serial, text, boolean, numeric, timestamp, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const channelsTable = pgTable("channels", {
  id: serial("id").primaryKey(),
  telegramId: text("telegram_id").notNull().unique(), // @username or -100xxxx
  name: text("name").notNull(),
  url: text("url").notNull(), // https://t.me/channel
  reward: numeric("reward", { precision: 10, scale: 4 }).notNull().default("0.0500"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const channelJoinsTable = pgTable("channel_joins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  channelId: integer("channel_id").notNull().references(() => channelsTable.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  rewardPaid: boolean("reward_paid").notNull().default(false),
});

export type Channel = typeof channelsTable.$inferSelect;
export type ChannelJoin = typeof channelJoinsTable.$inferSelect;
