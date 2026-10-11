# Coolify deploy — Kurdistan Athletes

## 1. Add PostgreSQL in Coolify

Create a **PostgreSQL** database resource.

Copy its internal `DATABASE_URL` (Coolify usually provides one).

## 2. Deploy the GitHub app

- Repository: `https://github.com/SoftwarePirmam/kurdistan-athletes`
- Build pack: **Dockerfile**
- Port: **3000**
- Domains:
  - `https://kurdistanathletes.com`
  - `https://www.kurdistanathletes.com`

### Environment variables

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?schema=public
NEXTAUTH_URL=https://kurdistanathletes.com
NEXTAUTH_SECRET=generate-a-long-random-string
ADMIN_EMAIL=admin@kurdistanathletes.com
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_NAME=Kurdistan Athletes Admin
```

Generate a secret:

```bash
openssl rand -base64 32
```

### Persistent storage (recommended)

- Source / name: `uploads`
- Destination: `/app/public/uploads`

This keeps uploaded founder photos and other images after redeploys.

## 3. Cloudflare

Keep the same settings as before:

- Proxied A records for `@` and `www`
- SSL/TLS: **Full** (then **Full (strict)**)
- Always Use HTTPS: On
- Email Address Obfuscation: Off

## 4. After deploy

1. Open `https://kurdistanathletes.com`
2. Login at `/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
3. Open `/admin`
4. Edit website text/images under **Website content**
5. Reply to users under **Messages**

Users must register before they can use Contact chat.
