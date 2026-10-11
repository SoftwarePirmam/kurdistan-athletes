#!/bin/sh
set -e

echo "Preparing database..."
npx prisma db push
npx tsx prisma/seed.ts

echo "Starting Kurdistan Athletes..."
exec node server.js
