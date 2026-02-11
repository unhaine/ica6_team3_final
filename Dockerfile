# =========================
# Stage 1: Dependencies
# =========================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# package 파일만 먼저 복사 (캐시 최적화)
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# 의존성 설치 (EC2 친화 옵션)
RUN npm install --no-audit --no-fund


# =========================
# Stage 2: Builder
# =========================
FROM node:20-alpine AS builder
WORKDIR /app

# deps 단계에서 설치한 node_modules 복사
COPY --from=deps /app/node_modules ./node_modules

# 나머지 소스 복사
COPY . .

# 빌드 환경 변수
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 🔥 EC2 생존 핵심 옵션
ENV NODE_OPTIONS="--max_old_space_size=768"
ENV NEXT_DISABLE_TURBOPACK=1

# Prisma Client 생성
RUN npx prisma generate

# Next.js build
RUN npm run build


# =========================
# Stage 3: Runner
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache postgresql-client

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 nextjs

# Next standalone 결과물
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma runtime 파일
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# uploads 디렉토리 및 캐시 디렉토리 권한 설정
RUN mkdir -p ./public/uploads ./.next/cache \
    && chown -R nextjs:nodejs ./public ./.next/cache

# 엔트리포인트
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN sed -i 's/\r$//' docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
