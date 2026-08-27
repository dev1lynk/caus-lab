#!/usr/bin/env bash
set -euo pipefail

# Keep merged environments aligned with the committed dependency lockfile.
npm install --no-audit --no-fund

# Apply committed Drizzle migrations without prompting.
npm run db:migrate