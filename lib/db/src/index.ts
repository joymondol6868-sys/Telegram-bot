import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { pool } from "./pool.js";

export { pool } from "./pool.js";
export const db = drizzle(pool, { schema });

export * from "./schema";
export { autoMigrate } from "./migrate.js";
