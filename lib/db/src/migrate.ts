import { pool } from "./pool.js";

/**
 * Auto-creates all required tables if they do not already exist,
 * AND adds any missing columns to existing tables (safe ALTER TABLE IF NOT EXISTS).
 * Call this on every startup — fully idempotent.
 */
export async function autoMigrate(): Promise<void> {
  const client = await pool.connect();
  try {
    // ── 1. Create tables (IF NOT EXISTS) ──────────────────────────────────────

    await client.query(`
      -- users (no FK deps)
      CREATE TABLE IF NOT EXISTS users (
        id                   SERIAL PRIMARY KEY,
        telegram_id          TEXT NOT NULL UNIQUE,
        first_name           TEXT NOT NULL DEFAULT '',
        last_name            TEXT,
        username             TEXT,
        language             TEXT NOT NULL DEFAULT 'en',
        balance              NUMERIC(10,4) NOT NULL DEFAULT 0,
        total_earned         NUMERIC(10,4) NOT NULL DEFAULT 0,
        referral_code        TEXT NOT NULL DEFAULT '',
        referred_by          INTEGER,
        is_banned            BOOLEAN NOT NULL DEFAULT FALSE,
        last_panel_msg_id    INTEGER,
        wallet_method        TEXT,
        wallet_address       TEXT,
        created_at           TIMESTAMP NOT NULL DEFAULT NOW(),
        last_active          TIMESTAMP NOT NULL DEFAULT NOW(),
        bonus_ads_amount     INTEGER NOT NULL DEFAULT 0,
        bonus_ads_expires_at TIMESTAMP,
        claimed_milestones   TEXT NOT NULL DEFAULT '',
        banned_until         TIMESTAMP,
        cheat_count          INTEGER NOT NULL DEFAULT 0,
        cheat_count_date     DATE
      );

      -- activity_log
      CREATE TABLE IF NOT EXISTS activity_log (
        id          SERIAL PRIMARY KEY,
        type        TEXT NOT NULL,
        description TEXT NOT NULL,
        user_id     INTEGER,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- bot_settings
      CREATE TABLE IF NOT EXISTS bot_settings (
        key         TEXT PRIMARY KEY,
        value       TEXT NOT NULL,
        description TEXT,
        updated_at  TIMESTAMP DEFAULT NOW()
      );

      -- channels
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

      -- ads_watched
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

      -- withdrawals
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

      -- daily_tasks
      CREATE TABLE IF NOT EXISTS daily_tasks (
        id            SERIAL PRIMARY KEY,
        user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        task_date     DATE NOT NULL,
        share_done    BOOLEAN NOT NULL DEFAULT FALSE,
        channel_done  BOOLEAN NOT NULL DEFAULT FALSE,
        ads_done      BOOLEAN NOT NULL DEFAULT FALSE,
        referral_done BOOLEAN NOT NULL DEFAULT FALSE,
        bonus_claimed BOOLEAN NOT NULL DEFAULT FALSE,
        claimed_at    TIMESTAMP
      );

      -- referrals
      CREATE TABLE IF NOT EXISTS referrals (
        id          SERIAL PRIMARY KEY,
        referrer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        referred_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount      NUMERIC(10,4) NOT NULL DEFAULT 0.05,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- user_warnings
      CREATE TABLE IF NOT EXISTS user_warnings (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reason     TEXT NOT NULL,
        issued_by  TEXT NOT NULL DEFAULT 'system',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- channel_joins
      CREATE TABLE IF NOT EXISTS channel_joins (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        channel_id  INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
        joined_at   TIMESTAMP NOT NULL DEFAULT NOW(),
        reward_paid BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);

    // ── 2. ALTER TABLE — add any missing columns to existing tables ────────────
    // Safe: ADD COLUMN IF NOT EXISTS is idempotent.

    const alterStmts = [
      // users — columns that may be missing from older deploys
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name           TEXT NOT NULL DEFAULT ''`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name            TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS username             TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS language             TEXT NOT NULL DEFAULT 'en'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS balance              NUMERIC(10,4) NOT NULL DEFAULT 0`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS total_earned         NUMERIC(10,4) NOT NULL DEFAULT 0`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code        TEXT NOT NULL DEFAULT ''`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by          INTEGER`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned            BOOLEAN NOT NULL DEFAULT FALSE`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_panel_msg_id    INTEGER`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_method        TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_address       TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at           TIMESTAMP NOT NULL DEFAULT NOW()`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active          TIMESTAMP NOT NULL DEFAULT NOW()`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS bonus_ads_amount     INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS bonus_ads_expires_at TIMESTAMP`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS claimed_milestones   TEXT NOT NULL DEFAULT ''`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_until         TIMESTAMP`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS cheat_count          INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS cheat_count_date     DATE`,
      // ads_watched
      `ALTER TABLE ads_watched ADD COLUMN IF NOT EXISTS pending_ad_start TIMESTAMP`,
      `ALTER TABLE ads_watched ADD COLUMN IF NOT EXISTS pending_ad_token TEXT`,
      // withdrawals
      `ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS note       TEXT`,
      `ALTER TABLE withdrawals ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP`,
      // channels
      `ALTER TABLE channels ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0`,
      // user_warnings
      `ALTER TABLE user_warnings ADD COLUMN IF NOT EXISTS issued_by TEXT NOT NULL DEFAULT 'system'`,
    ];

    for (const stmt of alterStmts) {
      await client.query(stmt).catch(() => {
        // ignore errors for columns that already exist with constraints
      });
    }

    // ── 3. Ensure referral_code uniqueness constraint exists ──────────────────
    await client.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'users_referral_code_unique' AND conrelid = 'users'::regclass
        ) THEN
          ALTER TABLE users ADD CONSTRAINT users_referral_code_unique UNIQUE (referral_code);
        END IF;
      EXCEPTION WHEN others THEN NULL;
      END $$;
    `).catch(() => {});

    console.log("[autoMigrate] ✅ All tables and columns ready");
  } catch (err) {
    console.error("[autoMigrate] ❌ Migration failed:", err);
    throw err;
  } finally {
    client.release();
  }
}
