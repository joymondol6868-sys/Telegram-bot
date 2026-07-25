import pg from "pg";

const { Pool } = pg;

const dbUrl = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("SUPABASE_DATABASE_URL or DATABASE_URL must be set.");
}

const sslConfig = process.env.SUPABASE_DATABASE_URL
  ? { rejectUnauthorized: false }
  : undefined;

export const pool = new Pool({ connectionString: dbUrl, ssl: sslConfig });
