# 📖 Telegram Earning Bot — A to Z Full Documentation

> This document explains **everything** about this bot project — architecture, features, database, flow, settings, anti-cheat, deployment — so any AI or developer can understand it completely from scratch.

---

## 🧭 Overview

This is a **Telegram Earning Bot** where users earn real USD by:
- Watching ads
- Completing daily tasks
- Referring friends
- Joining Telegram channels

Users can withdraw their earnings via multiple payment methods (bKash, Nagad, USDT, PayPal, etc.).

The bot is built with **Node.js + TypeScript**, uses **PostgreSQL** as the database, and is deployed on **Render.com** (Singapore region). It supports **12 languages**.

---

## 🗂️ Project Structure

```
Telegram-bot-main/
├── artifacts/
│   └── api-server/              ← Main backend (Express server + Telegram bot)
│       └── src/
│           ├── index.ts         ← Entry point: starts DB, bot, Express
│           ├── app.ts           ← Express app setup (CORS, JSON, routes)
│           ├── bot/
│           │   ├── index.ts     ← Bot logic (1775 lines): all commands, menus, flows
│           │   ├── db.ts        ← All database operations (queries, mutations)
│           │   └── languages.ts ← All messages in 12 languages (3982 lines)
│           ├── routes/
│           │   ├── index.ts     ← Route aggregator
│           │   ├── health.ts    ← GET /api/healthz
│           │   └── admin.ts     ← Admin REST API (439 lines)
│           └── lib/
│               ├── logger.ts    ← Pino logger
│               └── notify.ts    ← sendTelegramMessage() helper
├── lib/
│   ├── db/                      ← Database schema + migrations
│   │   └── src/schema/          ← All table definitions (Drizzle ORM)
│   ├── api-zod/                 ← Zod validation schemas (generated)
│   ├── api-client-react/        ← React Query hooks (generated from OpenAPI)
│   └── api-spec/                ← OpenAPI spec + Orval codegen config
├── render.yaml                  ← Render.com deployment config
└── RENDER_DEPLOY.md             ← Deploy instructions
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript (Node.js 24) |
| Bot Framework | [grammY](https://grammy.dev/) |
| Web Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Validation | Zod v4 + drizzle-zod |
| API Codegen | Orval (from OpenAPI spec) |
| Build | esbuild (CJS/ESM bundle) |
| Logging | Pino |
| Package Manager | pnpm workspaces |
| Deployment | Render.com (free tier, Singapore) |

---

## 🌍 Supported Languages

The bot supports **12 languages** with full message translation:

| Code | Language |
|---|---|
| `en` | 🇬🇧 English |
| `bn` | 🇧🇩 বাংলা (Bengali) |
| `hi` | 🇮🇳 हिन्दी (Hindi) |
| `ar` | 🇸🇦 العربية (Arabic) |
| `ru` | 🇷🇺 Русский (Russian) |
| `tr` | 🇹🇷 Türkçe (Turkish) |
| `ur` | 🇵🇰 اردو (Urdu) |
| `pa` | 🇮🇳 ਪੰਜਾਬੀ (Punjabi) |
| `id` | 🇮🇩 Indonesia |
| `fr` | 🇫🇷 Français (French) |
| `es` | 🇪🇸 Español (Spanish) |
| `pt` | 🇧🇷 Português (Portuguese) |

Every message shown to the user goes through `tr_(lang, "messageKey", { vars })` — a translation function that picks the right language string and fills in template variables.

---

## 🗄️ Database Tables (Schema)

All tables use Drizzle ORM with PostgreSQL. They are auto-created on first startup via `autoMigrate()`.

### 1. `users` — Main user table
```
id                  serial PK
telegram_id         text UNIQUE NOT NULL        ← Telegram user ID (string)
first_name          text NOT NULL
last_name           text
username            text                        ← Telegram @username
language            text DEFAULT 'en'           ← User's chosen language
balance             numeric(10,4) DEFAULT 0     ← Current withdrawable balance (USD)
total_earned        numeric(10,4) DEFAULT 0     ← All-time total earned
own_earned          numeric(10,4) DEFAULT 0     ← Earned from own activity (ads/tasks/channels)
referral_earned     numeric(10,4) DEFAULT 0     ← Earned from referrals
referral_code       text UNIQUE NOT NULL        ← 8-char code for referral links
referred_by         integer                     ← FK to users.id (who referred them)
is_banned           boolean DEFAULT false
last_panel_msg_id   integer                     ← Tracks last bot panel message (for cleanup/edit)
wallet_method       text                        ← Saved withdrawal method (e.g. "bkash")
wallet_address      text                        ← Saved wallet number/address
created_at          timestamp
last_active         timestamp

── Referral milestone system ──
bonus_ads_amount    integer DEFAULT 0           ← Extra ads/day from active milestone tier
bonus_ads_expires_at timestamp                  ← When the bonus expires
claimed_milestones  text DEFAULT ''             ← Comma-separated milestone thresholds already paid (e.g. "15,25")

── Anti-cheat ──
banned_until        timestamp                   ← Temporary ban expiry
cheat_count         integer DEFAULT 0           ← Cheat attempts today
cheat_count_date    date                        ← Date cheat_count belongs to

── Referral commission tracking ──
ref_commission_today numeric(10,4) DEFAULT 0   ← Commission earned today (resets daily)
ref_commission_date  date                       ← Date ref_commission_today belongs to

── Notifications ──
last_reminder_sent_at timestamp                 ← Last inactivity reminder sent
```

### 2. `ads_watched` — Ad watching per day
```
id              serial PK
user_id         integer FK → users.id
watch_date      date NOT NULL                   ← "2025-07-26" format
count           integer DEFAULT 0              ← Ads watched today
today_earned    numeric(10,4) DEFAULT 0        ← Amount earned today from ads
last_watched_at timestamp
pending_ad_start timestamp                      ← When ad session started (anti-cheat)
pending_ad_token text                           ← One-time token per ad session (anti-forgery)
```

### 3. `withdrawals` — Withdrawal requests
```
id          serial PK
user_id     integer FK → users.id
amount      numeric(10,4)
method      text                               ← "bkash", "usdt_trc20", etc.
address     text                               ← Wallet number/address
status      text DEFAULT 'pending'             ← "pending" | "approved" | "rejected"
note        text                               ← Admin note on rejection/approval
created_at  timestamp
updated_at  timestamp
```

### 4. `daily_tasks` — Daily task completion
```
id            serial PK
user_id       integer FK → users.id
task_date     date NOT NULL
ads_done      boolean DEFAULT false            ← Watched N ads today
share_done    boolean DEFAULT false            ← Shared bot today
channel_done  boolean DEFAULT false            ← Joined a channel today
referral_done boolean DEFAULT false            ← Referred a friend today
bonus_claimed boolean DEFAULT false            ← Daily bonus claimed
claimed_at    timestamp
```

### 5. `referrals` — Referral relationships
```
id                  serial PK
referrer_id         integer FK → users.id      ← Who shared the link
referred_id         integer FK → users.id      ← New user who joined
amount              text DEFAULT '0'           ← One-time signup bonus (historical)
first_activity_done boolean DEFAULT false      ← Has the referred user done real activity?
signup_bonus_paid   boolean DEFAULT false      ← Has the one-time signup bonus been paid?
created_at          timestamp
```

### 6. `activity_log` — System event log
```
id          serial PK
type        text                              ← "join", "referral", "ad_watch", "bonus", "withdrawal", "ban", "warning", "milestone", etc.
message     text
user_id     integer
created_at  timestamp
```

### 7. `channels` — Telegram channels users can join for rewards
```
id          serial PK
telegram_id text NOT NULL                     ← Telegram channel ID (e.g. "@mychannel")
name        text NOT NULL
url         text NOT NULL                     ← https://t.me/...
reward      numeric(10,4) DEFAULT 0.05        ← USD reward for joining
is_active   boolean DEFAULT true
sort_order  integer DEFAULT 0
created_at  timestamp
```

### 8. `channel_joins` — Which users joined which channels
```
id          serial PK
user_id     integer FK → users.id
channel_id  integer FK → channels.id
joined_at   timestamp
reward_paid boolean DEFAULT false
```

### 9. `bot_settings` — Admin-configurable settings
```
key         text PK
value       text NOT NULL
description text
updated_at  timestamp
```

### 10. `user_warnings` — Anti-cheat warnings
```
id          serial PK
user_id     integer FK → users.id
reason      text NOT NULL
issued_by   text DEFAULT 'system'             ← "system" or "admin"
created_at  timestamp
```

---

## 💰 Earning System

### 1. Watch Ads (`/earn`)
- User clicks "Watch Ads & Earn" button
- Bot calls `startAdWatch()` → creates a **pending session** with a unique `token` and `pendingAdStart` timestamp
- User is shown an ad (link via `ADS_URL` env variable)
- User clicks "Done Watching" → bot calls `completeAdWatch(userId, token)`
- Anti-cheat checks:
  - Token must match
  - At least `ad_min_seconds` (default: 10s) must have passed
  - Daily limit not exceeded
- If valid: balance is credited `ad_reward` (default: $0.01) via `creditOwnEarning()`
- Daily limit: `max_ads_per_day` (default: 25) + any active milestone bonus

### 2. Daily Tasks (`/rewards`)
Complete **all 4 tasks** in one day to claim the daily bonus:

| Task | How to complete |
|---|---|
| 📺 Watch Ads | Watch `ads_task_threshold` (default: 5) ads today |
| 📨 Share Bot | Click "Share" button (marked as done automatically) |
| 📢 Join Channel | Join any active channel and click Verify |
| 👥 Refer a Friend | Have a referred user complete their first activity |

- Daily bonus: `daily_bonus` (default: $0.20) per day
- Reset: midnight (task_date is a date field)

### 3. Referral Program (`/referrals`)
- Each user gets a unique 8-char referral code (e.g. `ABC12345`)
- Referral link: `https://t.me/BOT_USERNAME?start=ref_ABC12345`
- When a new user joins via referral link → referral record is created
- **Signup bonus is NOT paid immediately** — it's gated on first real activity (anti-fraud)
- On referred user's first ad/task/channel earning:
  - Referrer gets one-time `referral_reward` (default: $0.05)
  - Referral milestone count is checked and updated

#### Ongoing Lifetime Commission
- After the signup bonus is paid, every time the referred user earns from ads/tasks/channels:
  - Referrer gets `referral_commission_pct`% (default: 10%) of that earning
  - Capped at `referral_commission_daily_cap` (default: $1.00) per referrer per day
  - Commission does NOT chain (commissions don't generate further commissions)

#### Referral Milestone Tiers (Upgrade Daily Limit)
When a referrer accumulates enough **qualified** referrals, they unlock a tier:

| Referrals needed | Extra ads/day | Duration | One-time cash bonus |
|---|---|---|---|
| 15 | +10 ads | 7 days | $0.50 |
| 25 | +20 ads | 15 days | $1.00 |
| 40 | +35 ads | 30 days | $2.00 |
| 60 | +50 ads | 60 days | $3.50 |

- Each tier is unlocked **once only** (tracked in `claimed_milestones` column)
- Higher tiers **replace** lower ones (do not stack)
- Keeps the referral incentive alive: keep referring to maintain/extend the bonus

### 4. Join Channels (`/channel`)
- Admin adds Telegram channels via the admin API
- Each channel has a USD reward (default: $0.05)
- User clicks channel link → joins → clicks "Verify" button in bot
- Bot records the join and credits reward (one-time per channel per user)

---

## 💳 Withdrawal System

### Payment Methods Supported

| Method | ID | Countries |
|---|---|---|
| bKash | `bkash` | 🇧🇩 Bangladesh |
| Nagad | `nagad` | 🇧🇩 Bangladesh |
| Rocket | `rocket` | 🇧🇩 Bangladesh |
| UPI | `upi` | 🇮🇳 India |
| Paytm | `paytm` | 🇮🇳 India |
| Binance Pay | `binancepay` | 🌐 Global |
| USDT TRC-20 | `usdt_trc20` | 🌐 Global |
| USDT BEP-20 | `usdt_bep20` | 🌐 Global |
| BNB (BSC) | `bnb` | 🌐 Global |
| PayPal | `paypal` | 🌐 Global |
| TON | `ton` | 🌐 Global |
| Litecoin | `ltc` | 🌐 Global |

### Withdrawal Flow
1. User opens Wallet → "Request Withdrawal"
2. Bot runs **pre-check** (`getWithdrawalReadiness`):
   - Balance ≥ `min_withdrawal` (default: $0.50)?
   - At least `min_own_earning_ratio` (default: 40%) of lifetime earnings from own activity?
3. If eligible → user picks payment method → types wallet address
4. Bot validates address format per method
5. User confirms → withdrawal request created with status `pending`
6. Balance is **deducted** immediately on request
7. Admin approves/rejects via admin API
8. User receives Telegram notification in their language
9. If rejected → balance is **refunded**

### Anti-Fraud Withdrawal Rule
- `min_own_earning_ratio = 0.40` means:
  - If a user earned $1.00 lifetime total, at least $0.40 must be from ads/tasks/channels (not referrals)
  - Blocks the "create fake accounts to farm referral bonuses" abuse pattern

---

## 🛡️ Anti-Cheat System

### Token-based Ad Validation
- Each ad session gets a unique random token stored in `pending_ad_token`
- `completeAdWatch()` requires the exact token → prevents replayed/forged completions
- Token is cleared after use (or on cancel)

### Minimum Time Enforcement
- `ad_min_seconds` (default: 10 seconds) must pass between `startAdWatch` and `completeAdWatch`
- If user completes too fast → cheat detected

### Warning System
- On cheat attempt: `issueWarning(userId, reason)` is called
- If `cheat_warn = "1"` (enabled): warning is recorded
- After `warn_limit` (default: 3) warnings → user is **auto-banned permanently**
- Warnings visible in admin panel

### Temporary Ban
- `banned_until` field supports time-limited bans
- `cheat_count` + `cheat_count_date` track daily cheat attempts

---

## 👑 User Rank System

Based on `total_earned` (all-time earnings):

| Badge | Rank | Threshold |
|---|---|---|
| 🥉 | Bronze | $0.00+ |
| 🥈 | Silver | $1.00+ |
| 🥇 | Gold | $5.00+ |
| 💎 | Diamond | $20.00+ |
| 👑 | Legend | $50.00+ |

A visual progress bar shows distance to next rank.

---

## 🤖 Bot Menu Structure

### Main Menu (Reply Keyboard)
```
[ 👁 Watch Ads & Earn ]
[ 💳 Wallet ]   [ 👤 Dashboard ]
[ 🎁 Rewards ]  [ 👥 Referrals ]
[ 🎬 Video Zone ] [ 📢 Channel ]
[ ⚙️ Settings ] [ 💬 Support ]
```

### Panels (Inline Keyboards inside messages)

| Panel | Contents |
|---|---|
| **Earn** | Ad counter, today's earned, remaining ads, progress bar, Watch Ad button |
| **Dashboard/Profile** | Name, ID, rank badge, balance, total earned, referral stats, wallet info |
| **Rewards** | Daily task checklist (ads ✅/❌, share ✅/❌, channel ✅/❌, referral ✅/❌), Claim button |
| **Referrals** | Referral link, total referrals, total referral earned, milestone progress |
| **Upgrade Daily Limit** | All milestone tiers with status, current bonus info, referral link |
| **Wallet** | Balance, min payout, total withdrawn, Request/Set Wallet/History buttons |
| **Video Zone** | Adult Bot link, Movies & Series link |
| **Channel** | List of active channels with reward + Verify button |
| **Settings** | Change Name, Change Language buttons |
| **Support** | Support link |

---

## 🤖 Bot Commands & Flows

### `/start`
- If new user: creates account in DB
- If referral link (`/start ref_XXXXXX`): links referral
- Shows language selection keyboard on first visit
- Shows main menu after language is set

### Language Selection
- User picks from 12 language buttons
- Language saved to DB
- All subsequent messages shown in that language

### Ad Watch Flow
```
User → [Watch Ads & Earn]
     → Shows earn panel (count/limit/progress bar)
     → [Watch Ad Now] button
     → Redirected to ADS_URL (external ad link)
     → [I watched the ad ✅] button
     → Bot validates (token + timing)
     → Balance credited
     → Panel updated with new count
```

### Withdrawal Flow
```
User → [Wallet] → [Request Withdrawal]
     → Pre-check (balance + own-earning ratio)
     → Method selection keyboard
     → Type wallet address
     → Address validation
     → Confirmation screen
     → [Confirm] → Withdrawal request created (pending)
     → Admin approves/rejects via admin panel
     → User notified via Telegram message
```

### Referral Flow
```
User A shares: https://t.me/BOT?start=ref_ABCD1234
User B joins via link
  → referral record created (bonus_pending = false)
  → no money paid yet
User B watches first ad / completes first task
  → User A credited $0.05 (signup bonus)
  → User A's qualified referral count increases
  → Milestone check: did count reach 15/25/40/60?
  → If yes: cash bonus + daily ad bonus unlocked
Every subsequent earning by User B:
  → User A gets 10% commission (capped $1/day)
```

---

## 🔧 Admin REST API

All admin routes are at `/api/admin/...`. No authentication middleware in the code — protect this with IP allowlist or reverse proxy in production.

| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard stats: total users, active today, pending withdrawals, ads watched, new users, referrals |
| GET | `/api/admin/users` | List users (paginated, search by name/username, filter by status) |
| GET | `/api/admin/users/:id` | Single user detail with today's ads, total ads, referral count, withdrawal count |
| POST | `/api/admin/users/:id/ban` | Ban/unban a user |
| PATCH | `/api/admin/users/:id/balance` | Adjust user balance (add/subtract) |
| POST | `/api/admin/users/:id/warn` | Issue a manual warning to a user |
| GET | `/api/admin/withdrawals` | List withdrawals (paginated, filter by status) |
| PATCH | `/api/admin/withdrawals/:id` | Approve or reject a withdrawal (notifies user) |
| POST | `/api/admin/broadcast` | Send message to all users (or by language) |
| GET | `/api/admin/activity` | Last 50 activity log entries |
| GET | `/api/admin/channels` | List all channels |
| POST | `/api/admin/channels` | Add a new channel |
| PATCH | `/api/admin/channels/:id` | Edit channel details |
| DELETE | `/api/admin/channels/:id` | Remove a channel |
| GET | `/api/admin/settings` | Get all bot settings |
| PATCH | `/api/admin/settings` | Update one or more settings |
| GET | `/api/admin/warnings` | List warnings (filter by userId) |
| DELETE | `/api/admin/warnings/:id` | Delete a warning |

---

## ⚙️ Bot Settings (Admin-Configurable)

All settings stored in `bot_settings` table, editable via `PATCH /api/admin/settings`.

| Key | Default | Description |
|---|---|---|
| `ad_reward` | `0.0100` | USD credited per ad watched |
| `max_ads_per_day` | `25` | Base daily ad limit (before milestone bonus) |
| `referral_reward` | `0.0500` | One-time USD bonus per qualified referral |
| `min_withdrawal` | `0.50` | Minimum balance to request withdrawal |
| `daily_bonus` | `0.20` | USD bonus for completing all 4 daily tasks |
| `ads_task_threshold` | `5` | Ads needed to complete the daily ads task |
| `ad_min_seconds` | `10` | Min seconds required between ad start and complete |
| `warn_limit` | `3` | Warnings before auto-ban |
| `cheat_warn` | `1` | Enable warnings on cheat attempt (1=yes, 0=no) |
| `referral_commission_pct` | `10` | % of referred user's earnings paid to referrer (lifetime) |
| `referral_commission_daily_cap` | `1.00` | Max daily commission a referrer can earn |
| `min_own_earning_ratio` | `0.40` | Min fraction of lifetime earnings from own activity (for withdrawal) |

---

## 🌐 Environment Variables

Set in Render dashboard or `.env` file:

| Variable | Required | Description |
|---|---|---|
| `PORT` | ✅ | Server port (Render sets this automatically; set to 10000 in render.yaml) |
| `DATABASE_URL` | ✅ | PostgreSQL connection string (Supabase or Render PostgreSQL) |
| `TELEGRAM_BOT_TOKEN` | ✅ | From @BotFather |
| `WEBHOOK_URL` | ✅ (prod) | Full URL of deployed app (e.g. `https://mybot.onrender.com`). If not set, uses long polling (dev mode) |
| `BOT_USERNAME` | Optional | Bot's @username without @. Auto-detected from Telegram API if not set |
| `ADULT_BOT_LINK` | Optional | Link shown in Video Zone for adult content |
| `MOVIE_BOT_LINK` | Optional | Link shown in Video Zone for movies |
| `ADS_URL` | Optional | The URL shown to users when watching ads |

---

## 🚀 How the Server Starts

```
index.ts
  └─ autoMigrate()         ← Creates all DB tables (CREATE IF NOT EXISTS)
       └─ seedSettings()   ← Inserts default settings (skip if already exist)
       └─ startBot(app)    ← Initializes grammY bot
           └─ Webhook mode (if WEBHOOK_URL set) → fast, used on Render
           └─ Long polling mode (dev / no WEBHOOK_URL)
           └─ Background job: hourly inactivity reminders
       └─ app.listen(port) ← Express server starts
```

---

## 📡 Bot Modes

### Development (Long Polling)
- No `WEBHOOK_URL` env variable set
- Bot polls Telegram API for updates every few seconds
- Used on Replit dev environment

### Production (Webhook)
- `WEBHOOK_URL` is set to the Render app URL
- Telegram pushes updates to `POST /api/bot-webhook`
- Much faster, no polling delay
- Used on Render deployment

---

## 📲 Inactivity Reminder System

- Runs every hour (with 1-minute delay on startup)
- Finds users inactive for 24+ hours who haven't received a reminder in 24 hours
- Sends a "come back" message in their language
- Updates `last_reminder_sent_at` to prevent spam
- 50ms delay between messages to respect Telegram rate limits

---

## 🏗️ `creditOwnEarning()` — Central Earning Function

This is the most important function in `db.ts`. Called whenever a user earns from:
- Watching an ad
- Claiming daily bonus
- Joining a channel

**What it does:**
1. Credits the user's `balance` + `total_earned` + `own_earned`
2. Looks up if the user was referred by someone
3. If yes and this is their **first activity ever**:
   - Pays the referrer the one-time signup bonus
   - Updates referral counts
   - Checks milestone tiers → pays cash bonus if reached
   - Notifies referrer via Telegram
4. If not first activity:
   - Pays lifetime commission (10% capped at $1/day)

**Never call this with referral commission money** — commissions don't chain.

---

## 🔒 Session State Machine

The bot uses grammY sessions to track multi-step flows:

| State | Meaning |
|---|---|
| `selecting_wallet_method` | User is picking payment method to save to profile |
| `selecting_withdraw_method` | User is picking payment method for withdrawal |
| `await_wallet_address` | Bot waiting for user to type wallet number/address |
| `await_withdraw_address` | Bot waiting for withdrawal address |
| `await_withdraw_confirm` | Bot waiting for user to confirm withdrawal |
| `await_name_update` | Bot waiting for user to type their new name |
| `undefined` | Normal state, no active flow |

---

## 📊 Top Earners & Bot Stats

- `getTopEarners()` — returns leaderboard of highest earners
- `getBotStats()` — returns aggregate stats (total users, total paid out, etc.)
- Used in the Dashboard panel and admin stats

---

## 🏆 Deployment on Render

Configured via `render.yaml`:

```
Service type: Web Service
Runtime: Node.js
Region: Singapore (asia-closest)
Plan: Free
Build: pnpm install && pnpm build (esbuild bundle)
Start: node --enable-source-maps artifacts/api-server/dist/index.mjs
Health check: GET /api/healthz
Port: 10000
```

**Required manual setup in Render dashboard:**
1. Set `TELEGRAM_BOT_TOKEN`
2. Set `DATABASE_URL` (Supabase PostgreSQL connection string)
3. Set `WEBHOOK_URL` = `https://your-render-app-name.onrender.com`
4. Optionally set `ADULT_BOT_LINK`, `MOVIE_BOT_LINK`, `ADS_URL`

---

## 🔄 Full User Journey (A to Z)

```
1. User finds bot → clicks Start
2. Bot asks to pick language (12 options)
3. User picks language → Main Menu shown
4. User sees balance: $0.00
5. [Watch Ads & Earn] → Earn panel shown (0/25 ads today)
6. [Watch Ad Now] → redirected to ADS_URL
7. [Done ✅] → 10+ seconds? Yes → +$0.01, balance = $0.01
8. User watches 5 ads → daily ads task ✅
9. User shares bot → share task ✅
10. User joins a channel → +$0.05, channel task ✅
11. User refers a friend (sends referral link)
    → Friend joins and watches first ad
    → User gets +$0.05 referral bonus, referral task ✅
12. User has all 4 tasks done → [Claim Daily Bonus] → +$0.20
13. Balance grows over days
14. Balance reaches $0.50 (minimum withdrawal)
15. User opens Wallet → eligibility check:
    - Balance ≥ $0.50 ✅
    - 40% own-earned? ✅ (most earned from ads/tasks)
16. User picks bKash → types number 01712345678
17. Confirms → withdrawal request created (pending)
18. Balance deducted
19. Admin approves in admin panel
20. User receives Telegram message: "Your $0.50 bKash withdrawal has been approved!"
```

---

## 🛠️ Common Code Patterns

### Adding a new setting
1. Add to `DEFAULT_SETTINGS` in `lib/db/src/schema/bot_settings.ts`
2. Read via `getNumSetting("key", fallback)` or `getSetting("key")` in `db.ts`
3. It becomes available in admin API automatically

### Adding a new language
1. Add the language code to `type Lang` in `languages.ts`
2. Add it to `LANGUAGES` record
3. Add all message keys for that language in `walletMessages`, `messages`, etc.
4. Add button to `LANG_BUTTONS` array in `bot/index.ts`

### Adding a new payment method
1. Add to `WITHDRAW_METHODS` array in `bot/index.ts`
2. Add validation case in the wallet address validator
3. Add example in `getWalletExample()`
4. Add prompt text in `walletInputPrompt()`

### Adding a new admin route
1. Add route handler in `artifacts/api-server/src/routes/admin.ts`
2. Add Zod schema in `lib/api-zod/` if needed
3. Add to OpenAPI spec if you want codegen React hooks

---

## 📝 Key Files Quick Reference

| File | What it contains |
|---|---|
| `bot/index.ts` | ALL bot logic: command handlers, callback handlers, panel builders, session flows (1775 lines) |
| `bot/db.ts` | ALL database functions: user CRUD, ads, withdrawals, referrals, tasks, channels, settings (733 lines) |
| `bot/languages.ts` | ALL translated messages in 12 languages (3982 lines) |
| `routes/admin.ts` | Admin REST API: stats, users, withdrawals, channels, settings, warnings, broadcast (439 lines) |
| `lib/notify.ts` | `sendTelegramMessage()` — sends messages without needing the bot instance |
| `lib/db/src/schema/` | Database table definitions (Drizzle ORM) |
| `render.yaml` | Render.com deployment configuration |
| `RENDER_DEPLOY.md` | Step-by-step deployment guide |

---

*Generated automatically from source code. This document covers 100% of the bot's features, database schema, API, settings, flows, and deployment.*
