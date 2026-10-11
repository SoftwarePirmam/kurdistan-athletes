# Coolify
# Build pack: Dockerfile
# Base directory: /
# Dockerfile location: /Dockerfile
# Ports Exposes: 80
# Domains: https://kurdistanathletes.com,https://www.kurdistanathletes.com
FROM nginx:1.27-alpine

RUN apk add --no-cache curl

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html about.html opportunities.html support.html ways-we-help.html contact.html join.html 404.html robots.txt sitemap.xml /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY images /usr/share/nginx/html/images

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -fsS http://127.0.0.1/health || exit 1
