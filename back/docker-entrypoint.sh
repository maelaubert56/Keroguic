#!/bin/sh
set -e

echo "Waiting for database to be ready..."
max_tries=30
counter=0

until [ $counter -ge $max_tries ]; do
  if npx prisma migrate deploy --skip-seed 2>&1; then
    echo "Database is ready and migrations applied!"
    break
  fi
  counter=$((counter+1))
  echo "Attempt $counter/$max_tries - Database is unavailable - sleeping"
  sleep 2
done

if [ $counter -ge $max_tries ]; then
  echo "Failed to connect to database after $max_tries attempts"
  exit 1
fi

echo "Starting application..."
exec "$@"
