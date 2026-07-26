import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const botSettingsTable = pgTable("bot_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BotSetting = typeof botSettingsTable.$inferSelect;

// Default settings seeded on first boot
export const DEFAULT_SETTINGS: Record<string, { value: string; description: string }> = {
  ad_reward:          { value: "0.0100", description: "Dollar amount credited per ad watched" },
  max_ads_per_day:    { value: "25",     description: "Base ads a user can watch per day (before referral milestone bonus)" },
  referral_reward:    { value: "0.0500", description: "Dollar amount credited per valid referral" },
  min_withdrawal:     { value: "0.50",   description: "Minimum balance required to withdraw" },
  daily_bonus:        { value: "0.20",   description: "Total bonus for completing all daily tasks" },
  ads_task_threshold: { value: "5",      description: "Ads needed to complete the daily ads task" },
  ad_min_seconds:     { value: "10",     description: "Minimum seconds between ad_start and ad_complete" },
  warn_limit:         { value: "3",      description: "Number of warnings before auto-ban" },
  cheat_warn:         { value: "1",      description: "Issue warning on cheat attempt (1=yes, 0=no)" },

  // ─── Referral commission + anti-fraud ──────────────────────────────────────
  referral_commission_pct:        { value: "10",   description: "% of a referred user's ad/task earnings paid to the referrer, for life" },
  referral_commission_daily_cap:  { value: "1.00", description: "Max $ a referrer can earn from commissions in a single day (per referrer)" },
  min_own_earning_ratio:          { value: "0.40", description: "Min fraction (0-1) of a user's lifetime earnings that must come from their own activity (not referrals) to be allowed to withdraw" },
};
