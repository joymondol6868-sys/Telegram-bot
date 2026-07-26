import { logger } from "./logger.js";

/**
 * Sends a direct Telegram message to a user via the raw Bot API.
 * Uses fetch directly (not the grammy `bot` instance) so this can be called
 * from anywhere — admin routes, background jobs, or db-layer event hooks —
 * without needing the running bot instance in scope.
 *
 * Best-effort: never throws. A blocked bot (user hit "block") or an invalid
 * chat id just logs and moves on; it must never break the caller's request.
 */
export async function sendTelegramMessage(telegramId: string, text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: telegramId, text, parse_mode: "HTML" }),
    });
    if (!res.ok) {
      logger.warn({ telegramId, status: res.status }, "sendTelegramMessage failed");
      return false;
    }
    return true;
  } catch (err) {
    logger.warn({ err, telegramId }, "sendTelegramMessage error");
    return false;
  }
}
