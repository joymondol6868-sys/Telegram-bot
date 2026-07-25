import { pool } from "./index.js";

/**
 * Auto-creates all required tables if they do not already exist.
 * Safe to call on every startup — uses CREATE TABLE IF NOT EXISTS.
 * No manual `drizzle-kit push` needed on Render.
 */
export async function autoMigrate(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      -- 1. users
      CREATE TABLE IF NOT EXISTS users (
        id                  SERIAL PRIMARY KEY,
        telegram_id         TEXT NOT NULL UNIQUE,
        first_name          TEXT NOT NULL,
        last_name           TEXT,
        username            TEXT,
        language            TEXT NOT NULL DEFAULT 'en',
        balance             NUMERIC(10,4) NOT NULL DEFAULT 0,
        total_earned        NUMERIC(10,4) NOT NULL DEFAULT 0,
        referral_code       TEXT NOT NULL UNIQUE,
        referred_by         INTEGER,
        is_banned           BOOLEAN NOT NULL DEFAULT FALSE,
        last_panel_msg_id   INTEGER,
        wallet_method       TEXT,
        wallet_address      TEXT,
        created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
        last_active         TIMESTAMP NOT NULL DEFAULT NOW(),
        bonus_ads_amount    INTEGER NOT NULL DEFAULT 0,
        bonus_ads_expires_at TIMESTAMP,
        claimed_milestones  TEXT NOT NULL DEFAULT '',
        banned_until        TIMESTAMP,
        cheat_count         INTEGER NOT NULL DEFAULT 0,
        cheat_count_date    DATE
      );

      -- 2. activity_log (no FK deps)
      CREATE TABLE IF NOT EXISTS activity_log (
        id          SERIAL PRIMARY KEY,
        type        TEXT NOT NULL,
        description TEXT NOT NULL,
        user_id     INTEGER,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- 3. bot_settings (no FK deps)
      CREATE TABLE IF NOT EXISTS bot_settings (
        key         TEXT PRIMARY KEY,
        value       TEXT NOT NULL,
        description TEXT,
        updated_at  TIMESTAMP DEFAULT NOW()
      );

      -- 4. channels (no FK deps)
      CREATE TABLE IF NOT EXISTS channels (
        id          SERIAL PRIMARY KEY,
        telegram_id TEXT NOT NULL UNIQUE,
        name        TEXT NOT NULL,
        url         TEXT NOT NULL,
        reward      NUMERIC(10,4) NOT NULL DEFAULT 0.0500,
        is_active   BOOLEAN NOT NULL DEFAULT TRUE,
        sort_order  INTEGER NOT NULL DEFAULT 0,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- 5. ads_watched (FK: users)
      CREATE TABLE IF NOT EXISTS ads_watched (
        id               SERIAL PRIMARY KEY,
        user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        watch_date       DATE NOT NULL,
        count            INTEGER NOT NULL DEFAULT 0,
        today_earned     NUMERIC(10,4) NOT NULL DEFAULT 0,
        last_watched_at  TIMESTAMP NOT NULL DEFAULT NOW(),
        pending_ad_start TIMESTAMP,
        pending_ad_token TEXT
      );

      -- 6. withdrawals (FK: users)
      CREATE TABLE IF NOT EXISTS withdrawals (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount     NUMERIC(10,4) NOT NULL,
        method     TEXT NOT NULL,
        address    TEXT NOT NULL,
        status     TEXT NOT NULL DEFAULT 'pending',
        note       TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP
      );

      -- 7. daily_tasks (FK: users)
      CREATE TABLE IF NOT EXISTS daily_tasks (
        id             SERIAL PRIMARY KEY,
        user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        task_date      DATE NOT NULL,
        share_done     BOOLEAN NOT NULL DEFAULT FALSE,
        channel_done   BOOLEAN NOT NULL DEFAULT FALSE,
        ads_done       BOOLEAN NOT NULL DEFAULT FALSE,
        referral_done  BOOLEAN NOT NULL DEFAULT FALSE,
        bonus_claimed  BOOLEAN NOT NULL DEFAULT FALSE,
        claimed_at     TIMESTAMP
      );

      -- 8. referrals (FK: users x2)
      CREATE TABLE IF NOT EXISTS referrals (
        id          SERIAL PRIMARY KEY,
        referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        referred_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount      NUMERIC(10,4) NOT NULL DEFAULT 0.05,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- 9. user_warnings (FK: users)
      CREATE TABLE IF NOT EXISTS user_warnings (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reason     TEXT NOT NULL,
        issued_by  TEXT NOT NULL DEFAULT 'system',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- 10. channel_joins (FK: users + channels)
      CREATE TABLE IF NOT EXISTS channel_joins (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        channel_id  INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
        joined_at   TIMESTAMP NOT NULL DEFAULT NOW(),
        reward_paid BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);

    console.log("[autoMigrate] ✅ All tables ready");
  } catch (err) {
    console.error("[autoMigrate] ❌ Migration failed:", err);
    throw err;
  } finally {
    client.release();
  }
}
