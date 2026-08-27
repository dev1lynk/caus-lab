---
name: Replit Postgres driver
description: Driver compatibility guidance for runtime database queries in this Replit environment.
---

Use Drizzle's node-postgres driver for application runtime queries against the Replit-managed PostgreSQL database. The Neon HTTP client can return an invalid empty-result shape for ordinary SELECT queries, causing a runtime error even though the database is reachable.

**Why:** The Ask Anything published-question feed exposed this behavior when the table had no rows; switching to node-postgres resolved it.

**How to apply:** Keep `DATABASE_URL` as the connection source, use a `pg` Pool with Drizzle's node-postgres adapter, and reserve Neon HTTP for environments where its response behavior is confirmed.