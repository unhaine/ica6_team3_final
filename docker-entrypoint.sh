#!/bin/sh

set -e



echo "?? Starting RefrigerAI..."



# Wait for database to be ready

echo "??Waiting for PostgreSQL..."

until pg_isready -h db -p 5432; do

  sleep 2

done



echo "??PostgreSQL is ready!"



# Run Prisma sync

echo "?봽 Syncing database schema with Prisma..."

npx prisma db push --accept-data-loss --url "$DATABASE_URL" --schema prisma/schema.prisma || echo "?좑툘  Schema sync failed, continuing..."



echo "??Application is starting..."



# Execute the main command

exec "$@"
