import { PrismaClient } from '@prisma/client';

let databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  // If connecting through Supabase pooler (port 6543) without ?pgbouncer=true,
  // append it to disable named prepared statements (fixes Postgres error 42P05)
  const isPooler = databaseUrl.includes(':6543') || databaseUrl.includes('pooler.supabase.com');
  const hasPgbouncer = databaseUrl.includes('pgbouncer=true');
  if (isPooler && !hasPgbouncer) {
    const separator = databaseUrl.includes('?') ? '&' : '?';
    databaseUrl = `${databaseUrl}${separator}pgbouncer=true`;
    process.env.DATABASE_URL = databaseUrl;
  }
}

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;