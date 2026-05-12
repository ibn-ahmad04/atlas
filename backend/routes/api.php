<?php

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — préfixe global : /api/v1/
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── Authentification ─────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {

        // POST /api/v1/auth/register
        Route::post('/register', [AuthController::class, 'register']);

        // POST /api/v1/auth/login
        Route::post('/login', [AuthController::class, 'login']);

        // Routes protégées par Sanctum
        Route::middleware('auth:sanctum')->group(function () {

            // POST /api/v1/auth/logout
            Route::post('/logout', [AuthController::class, 'logout']);

            // GET /api/v1/auth/me
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    // ── Ressources (à implémenter dans les branches suivantes) ───────────
    // GET  /api/v1/agents
    // GET  /api/v1/agents/{id}
    // POST /api/v1/bookings
});
