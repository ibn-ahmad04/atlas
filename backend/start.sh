#!/bin/bash
# start.sh

# Exit on error
set -e

echo "Clearing and caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Linking storage..."
php artisan storage:link || true

echo "Running migrations..."
php artisan migrate --force

echo "Starting Apache..."
apache2-foreground
