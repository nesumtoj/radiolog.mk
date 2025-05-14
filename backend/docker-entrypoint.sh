#!/bin/sh

# Wait for PostgreSQL to be available
until nc -z db 5432; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

# Run Prisma migrations
npx prisma migrate deploy

# Start the Node.js server
exec "$@"
