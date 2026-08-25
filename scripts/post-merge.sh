#!/usr/bin/env bash
set -euo pipefail

# Keep merged environments aligned with the committed dependency lockfile.
npm install --no-audit --no-fund

# Apply any committed Drizzle schema changes without prompting.
npm run db:push -- --force