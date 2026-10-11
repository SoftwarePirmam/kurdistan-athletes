# Coolify
# Build pack: Dockerfile
# Ports Exposes: 3000
# Domains: https://kurdistanathletes.com,https://www.kurdistanathletes.com
#
# No separate database needed. SQLite is created automatically.
#
# Persistent storage (recommended):
#   Destination: /app/data
#
# Optional env:
#   NEXTAUTH_URL=https://kurdistanathletes.com
#   NEXTAUTH_SECRET=...
#   ADMIN_EMAIL=admin@kurdistanathletes.com
#   ADMIN_PASSWORD=...
#   ADMIN_NAME=Kurdistan Athletes Admin

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="file:./data/build.db"
RUN mkdir -p ./data \
  && npx prisma generate \
  && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL="file:/app/data/prod.db"

RUN apk add --no-cache openssl curl

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN sed -i 's/\r$//' ./docker-entrypoint.sh \
  && chmod +x ./docker-entrypoint.sh \
  && mkdir -p ./data/uploads ./public/uploads

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=5 \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
