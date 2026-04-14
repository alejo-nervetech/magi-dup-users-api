#!/bin/sh
set -e

echo "Running database migrations..."
npm run migrate

echo "Running database seed..."
# The seed is idempotent — it will just error and skip if already seeded
node ./database/seed.js || echo "Seed skipped (likely already seeded)"

echo "Starting application..."
exec node index.js
