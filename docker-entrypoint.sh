#!/bin/sh
set -e

mkdir -p /app/data/uploads

# Keep uploads on the same persistent volume as the database
if [ ! -L /app/public/uploads ]; then
  rm -rf /app/public/uploads
  ln -sfn /app/data/uploads /app/public/uploads
fi

export DATABASE_URL="${DATABASE_URL:-file:/app/data/prod.db}"
export NEXTAUTH_URL="${NEXTAUTH_URL:-https://kurdistanathletes.com}"
export ADMIN_EMAIL="${ADMIN_EMAIL:-admin@kurdistanathletes.com}"
export ADMIN_PASSWORD="${ADMIN_PASSWORD:-ChangeThisPassword123!}"
export ADMIN_NAME="${ADMIN_NAME:-Kurdistan Athletes Admin}"

if [ -z "$NEXTAUTH_SECRET" ]; then
  if [ -f /app/data/nextauth_secret ]; then
    NEXTAUTH_SECRET="$(cat /app/data/nextauth_secret)"
  else
    NEXTAUTH_SECRET="$(openssl rand -base64 48)"
    echo "$NEXTAUTH_SECRET" > /app/data/nextauth_secret
  fi
  export NEXTAUTH_SECRET
fi

echo "Preparing SQLite database at $DATABASE_URL ..."
npx prisma db push
npx tsx prisma/seed.ts

echo "Starting Kurdistan Athletes on port ${PORT:-3000} ..."
exec node server.js
