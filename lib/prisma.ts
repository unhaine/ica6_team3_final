import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// PrismaClient를 전역 싱글톤으로 관리 (개발 환경에서 hot-reload 시 중복 생성 방지)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Next.js 15/16 + Prisma 7+ 에서는 Driver Adapter 사용이 권장됩니다.
const connectionString = process.env.DATABASE_URL || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn']
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
