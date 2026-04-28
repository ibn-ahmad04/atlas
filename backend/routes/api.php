<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — préfixe global : /api/v1/
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ── Santé du serveur ─────────────────────────────────────────────────
    Route::get('/', function () {
        return response()->json([
            'success' => true,
            'message' => 'Atlas API v1 is alive',
            'data'    => null,
        ]);
    });

    // ── Authentification ─────────────────────────────────────────────────
    // POST /api/v1/auth/register
    // POST /api/v1/auth/login
    // POST /api/v1/auth/logout
    // → À implémenter dans feature/m1-auth

    // ── Routes protégées ─────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/user', function (Request $request) {
            return response()->json([
                'success' => true,
                'message' => 'Utilisateur authentifié',
                'data'    => $request->user(),
            ]);
        });

        // GET /api/v1/agents
        // GET /api/v1/agents/{id}
        // POST /api/v1/bookings
        // → À implémenter selon les conventions (voir CONVENTIONS.md)
    });
});
