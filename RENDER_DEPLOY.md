# 🚀 Render Free Deploy Guide — Telegram Bot

## ✅ এই zip-এ যা আছে
- সম্পূর্ণ bot source code (TypeScript + Grammy)
- Supabase database support
- Webhook mode (ultra-fast ~100ms response)
- Render deploy config (`render.yaml`)

---

## STEP 1 — Supabase Database তৈরি করো (Free Forever)

1. [supabase.com](https://supabase.com) → **Start your project** → GitHub দিয়ে sign in
2. **New Project** → Organization select → নাম দাও → password দাও → Region: **Southeast Asia (Singapore)** → Create
3. Project ready হলে: **Project Settings → Database → Connection String → URI** tab-এ যাও
4. URI copy করো — এরকম দেখাবে:
   ```
   postgresql://postgres.xxxx:PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
   ```
5. এই URL টা সেভ করে রাখো — পরে Render-এ লাগবে

---

## STEP 2 — GitHub-এ Code Upload করো

### Option A — GitHub Desktop (সহজ)
1. [github.com](https://github.com) → New Repository → নাম দাও (e.g. `telegram-bot`) → Private → Create
2. zip extract করো → সব ফাইল repository folder-এ রাখো
3. GitHub Desktop দিয়ে Commit → Push

### Option B — GitHub.com দিয়ে (drag & drop)
1. New Repository তৈরি করো
2. "uploading an existing file" click করো
3. সব ফাইল drag করে upload করো → Commit

---

## STEP 3 — Render-এ Deploy করো (Free)

1. [render.com](https://render.com) → **Get Started for Free** → GitHub দিয়ে sign in
2. **New → Web Service**
3. **Connect a repository** → তোমার bot repo select করো
4. Settings:
   - **Name:** `telegram-bot` (যেকোনো নাম)
   - **Region:** Singapore
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:**
     ```
     npm install -g pnpm@10 && pnpm install --frozen-lockfile && pnpm --filter @workspace/api-server run build
     ```
   - **Start Command:**
     ```
     node --enable-source-maps artifacts/api-server/dist/index.mjs
     ```
   - **Plan:** Free

5. **Environment Variables** এ নিচের সব add করো:

   | Key | Value |
   |-----|-------|
   | `TELEGRAM_BOT_TOKEN` | BotFather থেকে পাওয়া token |
   | `DATABASE_URL` | Supabase connection string (Step 1 এ পাওয়া) |
   | `PORT` | `10000` |
   | `NODE_ENV` | `production` |
   | `WEBHOOK_URL` | **এখন খালি রাখো** — deploy হওয়ার পর দেবে |

6. **Create Web Service** click করো → Deploy শুরু হবে (~3-5 মিনিট)

---

## STEP 4 — Webhook URL সেট করো

Deploy সফল হলে Render তোমাকে একটা URL দেবে:
```
https://telegram-bot-xxxx.onrender.com
```

1. Render Dashboard → তোমার service → **Environment**
2. `WEBHOOK_URL` এ সেই URL paste করো (শেষে `/` ছাড়া)
3. **Save Changes** → Render auto-redeploy করবে
4. Log-এ দেখবে:
   ```
   Bot started (webhook mode)
   ```

---

## STEP 5 — UptimeRobot দিয়ে Bot কখনো বন্ধ হবে না ♾️

Render free tier ১৫ মিনিট inactive থাকলে sleep করে। UptimeRobot প্রতি ৫ মিনিটে ping করবে।

1. [uptimerobot.com](https://uptimerobot.com) → **Register for FREE**
2. **Add New Monitor**:
   - Monitor Type: **HTTP(s)**
   - Friendly Name: `Telegram Bot`
   - URL: `https://তোমার-render-url.onrender.com/api/healthz`
   - Monitoring Interval: **5 minutes**
3. **Create Monitor** → Done!

এখন bot কখনো sleep করবে না — **lifetime free** ✅

---

## ⚡ Bot Speed

| Mode | Response Time | কোথায় |
|------|--------------|-------|
| Polling | ১-৩ সেকেন্ড | Replit (dev) |
| **Webhook** | **~১০০ms** | **Render (prod)** |

---

## 🔄 ভবিষ্যতে Bot Update করতে

1. Replit-এ code change করো
2. GitHub-এ push করো
3. Render **auto-deploy** করবে ✅

---

## ❓ সমস্যা হলে

| সমস্যা | সমাধান |
|--------|--------|
| Build fail | Log দেখো, সাধারণত pnpm version issue |
| Bot respond করছে না | WEBHOOK_URL ঠিক আছে কিনা দেখো |
| Database error | Supabase URL ঠিকমতো copy হয়েছে কিনা দেখো |
| Render sleep করছে | UptimeRobot ঠিকমতো set হয়েছে কিনা দেখো |
