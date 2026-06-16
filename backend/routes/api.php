<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\AgentController;
use App\Http\Controllers\Api\V1\AvailabilityController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\AgentVerificationController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\AdminController;

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
            Route::post('/profile/info', [ProfileController::class, 'updateInfo']);
            Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);
            Route::post('/profile/cover', [ProfileController::class, 'updateCover']);
            Route::post('/agents/verify', [AgentVerificationController::class, 'requestVerification']);
        });
    });

    // PUBLIC
    Route::get('/agents',     [AgentController::class,'index']);
    Route::get('/agents/{id}',[AgentController::class,'show']);
    Route::get('/agents/{agentId}/availabilities', [AvailabilityController::class,'index']);
    Route::get('/agents/{agentId}/reviews', [ReviewController::class, 'index']);
    Route::get('/destinations', [\App\Http\Controllers\Api\V1\DestinationController::class, 'index']);
    Route::get('/posts', [\App\Http\Controllers\Api\V1\PostController::class, 'index']);

    // PROTÉGÉES
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/reports', [\App\Http\Controllers\Api\V1\ReportController::class, 'store']);
        Route::post('/reviews', [ReviewController::class, 'store']);
        Route::put('/agents/profile', [AgentController::class,'updateProfile']);
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

        // POSTS (Exploits)
        Route::post('/agent/posts', [\App\Http\Controllers\Api\V1\PostController::class, 'store']);
        Route::delete('/agent/posts/{id}', [\App\Http\Controllers\Api\V1\PostController::class, 'destroy']);

        // ADMIN
        Route::prefix('admin')->group(function () {
            Route::get('/stats', [AdminController::class, 'stats']);
            Route::get('/agents-pending', [AdminController::class, 'pendingAgents']);
            Route::get('/users', [AdminController::class, 'users']);
            Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
            Route::patch('/agents/{id}/validate', [AdminController::class, 'validateAgent']);
            Route::patch('/agents/{id}/refuse', [AdminController::class, 'refuseAgent']);
            Route::get('/reports', [AdminController::class, 'reports']);
            Route::post('/destinations', [\App\Http\Controllers\Api\V1\DestinationController::class, 'store']);
            Route::delete('/destinations/{id}', [\App\Http\Controllers\Api\V1\DestinationController::class, 'destroy']);
        });
    });
});
