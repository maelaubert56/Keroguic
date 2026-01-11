#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until npx prisma migrate status 2>&1 | grep -q "Database connection established" || npx prisma db execute --stdin < /dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec "$@"
