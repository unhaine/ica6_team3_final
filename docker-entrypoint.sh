#!/bin/sh
set -e

echo "🚀 Starting RefrigerAI..."

# Wait for database to be ready
echo "⏳ Waiting for PostgreSQL..."
until wget --quiet --tries=1 --spider http://db:5432 2>/dev/null; do
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run Prisma migrations
echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy || echo "⚠️  Migration failed, continuing..."

echo "✅ Application is starting..."

# Execute the main command
exec "$@"
