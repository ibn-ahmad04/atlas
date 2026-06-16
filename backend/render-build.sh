#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo "Caching config..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Linking storage..."
php artisan storage:link || true

echo "Running migrations..."
php artisan migrate --force

echo "Build complete."
