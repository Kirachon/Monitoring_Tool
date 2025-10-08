#!/bin/bash
set -e

echo "Running database migrations..."
npx knex migrate:latest --env production

echo "Running database seeds..."
npx knex seed:run --env production || true

echo "Pre-deploy tasks completed!"

