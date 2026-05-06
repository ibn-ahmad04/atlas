<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

/*
|---------------------------------------
| AUTH ROUTES
|---------------------------------------
*/
Route::prefix('v1/auth')->group(function () {

    // PUBLIC
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // PROTÉGÉES (login requis)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

/*
|---------------------------------------
| TEST ROUTE (PUBLIC)
|---------------------------------------
*/
Route::get('/test', function () {
    return response()->json([
        'ok' => true,
        'message' => 'API fonctionne'
    ]);
});