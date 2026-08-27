import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL;
const { Pool } = pg;

export const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : null;

export const db = databaseUrl
  ? drizzle(pool!, { schema })
  : null;

export function requireDb() {
  if (!db) {
    throw new Error("DATABASE_URL is not configured");
  }
  return db;
}