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

echo "Creating admin user if not exists..."
php artisan tinker --execute="if(!App\Models\User::where('email', 'admin@atlas.com')->exists()) { App\Models\User::create(['name'=>'Admin Atlas','email'=>'admin@atlas.com','password'=>'password','role'=>'admin']); }"

echo "Starting Apache..."
apache2-foreground
