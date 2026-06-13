<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\AgentController;
use App\Http\Controllers\Api\V1\AvailabilityController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\NotificationController;

Route::get('/test-connection', fn() => response()->json([
    'success' => true,
    'message' => 'API Atlas connectée !',
    'data'    => null
]));

Route::prefix('v1')->group(function () {

    // AUTH — M1
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class,'register']);
        Route::post('/login',    [AuthController::class,'login']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout',[AuthController::class,'logout']);
            Route::get('/me',    [AuthController::class,'me']);
        });
    });

    // PUBLIC
    Route::get('/agents',     [AgentController::class,'index']);
    Route::get('/agents/{id}',[AgentController::class,'show']);
    Route::get('/agents/{agentId}/availabilities',
        [AvailabilityController::class,'index']);

    // PROTÉGÉES
    Route::middleware('auth:sanctum')->group(function () {
        Route::put('/agents/profile',
            [AgentController::class,'updateProfile']);
        Route::post('/availabilities',
            [AvailabilityController::class,'store']);
        Route::delete('/availabilities/{id}',
            [AvailabilityController::class,'destroy']);
        Route::post('/bookings',
            [BookingController::class,'store']);
        Route::get('/bookings',
            [BookingController::class,'index']);
        Route::patch('/bookings/{id}/accept',
            [BookingController::class,'accept']);
        Route::patch('/bookings/{id}/refuse',
            [BookingController::class,'refuse']);
        Route::get('/notifications',
            [NotificationController::class,'index']);
        Route::patch('/notifications/{id}/read',
            [NotificationController::class,'markAsRead']);
    });
});
