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

## Persistent storage (important)

Add one storage volume:

- Destination: `/app/data`

This keeps:
- the SQLite database
- uploaded images
- the generated auth secret

Without this volume, redeploys can reset users and uploads.

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
```

If `NEXTAUTH_SECRET` is empty, the container generates and stores one in `/app/data`.

## After deploy

1. Open `https://kurdistanathletes.com`
2. Login at `/login` with your admin email/password
3. Use `/admin` for users, chat, and website content editing

## Cloudflare

- Proxied A records for `@` and `www`
- SSL/TLS: **Full** (then **Full (strict)**)
- Always Use HTTPS: On
- Email Address Obfuscation: Off
