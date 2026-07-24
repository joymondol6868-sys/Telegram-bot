import { spawnSync } from "child_process";
import app from "./app.js";
import { logger } from "./lib/logger.js";
import { startBot } from "./bot/index.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// ── Auto-migrate: push DB schema before starting ─────────────────────────────
logger.info("Running database schema push...");
const migResult = spawnSync(
  "node",
  [
    "node_modules/.bin/drizzle-kit",
    "push",
    "--force",
    "--config",
    "lib/db/drizzle.config.ts",
  ],
  {
    stdio: "inherit",
    cwd: process.cwd(),
    env: process.env,
  },
);

if (migResult.status !== 0) {
  logger.error("Database schema push failed — aborting startup");
  process.exit(1);
}
logger.info("Database schema push complete");

// ── Start Telegram bot and HTTP server ───────────────────────────────────────
startBot(app);

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
