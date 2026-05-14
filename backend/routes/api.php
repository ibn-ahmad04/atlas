<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AgentController;
use App\Http\Controllers\Api\V1\AvailabilityController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\NotificationController;

Route::prefix('v1')->group(function () {

    // Routes publiques
    Route::get('/agents', [AgentController::class, 'index']);
    Route::get('/agents/{id}', [AgentController::class, 'show']);
    Route::get('/agents/{agentId}/availabilities', [AvailabilityController::class, 'index']);

    // Routes protégées
    Route::middleware('auth:sanctum')->group(function () {
        Route::put('/agents/profile', [AgentController::class, 'updateProfile']);

        Route::post('/availabilities', [AvailabilityController::class, 'store']);
        Route::delete('/availabilities/{id}', [AvailabilityController::class, 'destroy']);

        Route::post('/bookings', [BookingController::class, 'store']);
        Route::get('/bookings', [BookingController::class, 'index']);
        Route::patch('/bookings/{id}/accept', [BookingController::class, 'accept']);
        Route::patch('/bookings/{id}/refuse', [BookingController::class, 'refuse']);

        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    });
});
