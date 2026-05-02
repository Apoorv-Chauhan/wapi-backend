# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
RUN apk add --no-cache git
WORKDIR /app

# ── deps ──────────────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --omit=dev --no-audit --no-fund

# ── runner ────────────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3001
CMD ["node", "server.js"]
