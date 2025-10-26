FROM node:20-alpine

# Git für Clone
RUN apk add --no-cache git

# Arbeitsverzeichnis
WORKDIR /app

# Repo klonen (leer räumen + flach nach /app schieben, egal ob Unterordner entsteht)
RUN git clone --depth 1 https://github.com/Monsieur-Bandana/michis_hochzeit.git /tmp/repo \
 && mkdir -p /app \
 && sh -c 'shopt -s dotglob || true; mv /tmp/repo/* /app/ 2>/dev/null || mv /tmp/repo/* /app/ || true' || true

# Sanity-Check: package.json muss da sein
RUN node -v && npm -v && ls -la \
 && test -f package.json || (echo "❌ package.json fehlt in /app"; exit 1)

# Dependencies (nutzt lockfile falls vorhanden)
RUN npm ci || npm install

# Vite-Port
EXPOSE 5173

# Start: Vite direkt (ohne npm scripts), Host nach außen öffnen
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]
