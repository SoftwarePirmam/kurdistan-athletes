# Coolify deploy — Kurdistan Athletes

No separate PostgreSQL database is required.
The app creates and uses its own SQLite database automatically.

## Deploy settings

- Repository: `https://github.com/SoftwarePirmam/kurdistan-athletes`
- Build pack: **Dockerfile**
- Port: **3000**
- Domains:
  - `https://kurdistanathletes.com`
  - `https://www.kurdistanathletes.com`

## Persistent storage (required)

Add one storage volume or admin edits will disappear on redeploy:

- Destination: `/app/data`

This keeps:
- the SQLite database (all website content, users, chats, events)
- uploaded images (QR codes, event photos, founder photo uploads)
- the generated auth secret

In Coolify:

1. Open the application
2. Go to **Storages** / **Persistent Storage**
3. Add storage with destination `/app/data`
4. Redeploy

Without this volume, every redeploy starts with a fresh empty database.

## Environment variables

Minimum recommended:

```env
NEXTAUTH_URL=https://kurdistanathletes.com
ADMIN_EMAIL=admin@kurdistanathletes.com
ADMIN_PASSWORD=choose-a-strong-password
```

Optional:

```env
NEXTAUTH_SECRET=any-long-random-string
ADMIN_NAME=Kurdistan Athletes Admin
DATABASE_URL=file:/app/data/prod.db
FORCE_ADMIN_PASSWORD_RESET=false
```

Notes:
- Seed no longer overwrites admin content edits on redeploy.
- Admin password is only reset if `FORCE_ADMIN_PASSWORD_RESET=true`.
- If `NEXTAUTH_SECRET` is empty, the container generates and stores one in `/app/data`.

## After deploy

1. Confirm `/app/data` storage is attached
2. Open `https://kurdistanathletes.com`
3. Login at `/login`
4. Edit content in `/admin` — changes stay after redeploy

## Cloudflare

- Proxied A records for `@` and `www`
- SSL/TLS: **Full** (then **Full (strict)**)
- Always Use HTTPS: On
- Email Address Obfuscation: Off
