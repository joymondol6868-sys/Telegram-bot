import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const userWarningsTable = pgTable("user_warnings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  issuedBy: text("issued_by").notNull().default("system"), // "system" | "admin:<adminId>"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type UserWarning = typeof userWarningsTable.$inferSelect;
