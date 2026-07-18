# Stage 1: install dependencies from package-lock.json
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the JS bundle at build time, so they must
# be passed as build args (docker build --build-arg / compose build.args), not
# just container env vars at runtime (those would arrive too late).
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
ARG NEXT_PUBLIC_IMAGE_BASE_URL=http://localhost:8080
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_IMAGE_BASE_URL=$NEXT_PUBLIC_IMAGE_BASE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# output:"standalone" bakes next.config.mjs's resolved values (incl. images.*)
# into the build, so this also needs to be a build arg, not just a runtime env.
ARG NEXT_IMAGE_UNOPTIMIZED=""
ENV NEXT_IMAGE_UNOPTIMIZED=$NEXT_IMAGE_UNOPTIMIZED

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: run the standalone production server
FROM alpine:3.20 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache nodejs \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
