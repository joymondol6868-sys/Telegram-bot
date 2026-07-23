# Telegram Earning Bot

A Telegram bot that lets users earn money by watching ads, completing daily tasks, referring friends, and joining channels. Supports multi-language, withdrawal via bKash/Nagad/USDT/etc., and a full admin panel.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server + bot (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `TELEGRAM_BOT_TOKEN` — Bot token from @BotFather
- Optional env: `BOT_USERNAME`, `ADULT_BOT_LINK`, `MOVIE_BOT_LINK`, `ADS_URL`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Bot: grammy (Telegram bot framework)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/src/bot/index.ts` — main bot logic (all handlers, panels, menus)
- `artifacts/api-server/src/bot/db.ts` — all database queries used by the bot
- `artifacts/api-server/src/bot/languages.ts` — all translation strings (12 languages)
- `artifacts/api-server/src/routes/admin.ts` — admin REST API (users, withdrawals, settings, channels, broadcast)
- `lib/db/src/schema/` — DB schema (users, ads, withdrawals, referrals, daily tasks, channels, bot settings, warnings, activity log)

## Architecture decisions

- Webhook mode on Render (production), polling in dev — bot uses `webhookCallback` when `expressApp` is provided
- Session stored in grammy's built-in in-memory session (stateless-friendly for Render)
- All bot earnings, limits, and reward amounts are configurable via `bot_settings` table (no code changes needed)
- Admin API is unauthenticated (IP-restricted on Render) — add auth middleware if exposed publicly
- `showPanel` / `editPanel` helpers ensure only one bot message is ever visible per user (clean UX)

## Product

- **Watch Ads** — users watch a timed ad and earn per-view reward
- **Referral** — earn bonus per new user who joins via your link
- **Daily Tasks** — complete ads + share + join channel + refer → claim daily bonus
- **Channels** — join sponsor channels for instant rewards
- **Wallet** — set payout method (bKash, Nagad, Rocket, UPI, USDT, BNB, PayPal, TON, LTC, etc.)
- **Withdraw** — request withdrawal when balance ≥ minimum
- **Admin** — manage users, approve/reject withdrawals, broadcast messages, configure bot settings, add channels

## User preferences

- Bot is already deployed on Render; only code changes are needed here, then push to GitHub
- Language: Bengali (user communicates in Bengali)

## Gotchas

- After any code change, commit and push to GitHub; Render auto-deploys from the `main` branch
- `grammy` must be in `dependencies` (not devDependencies) in `artifacts/api-server/package.json`
- Languages file is very large — grep before reading it fully
- The bot's `min_withdrawal` setting is always overwritten on startup (seeded fresh every restart)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- GitHub repo: https://github.com/risha9977/telegram-bot
