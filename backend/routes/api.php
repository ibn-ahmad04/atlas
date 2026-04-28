<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/test', function () {
        return response()->json([
            'success' => true,
            'message' => 'Le backend répond parfaitement !',
            'data' => null
        ]);
    });

    Route::get('/', function () {
        return response()->json([
            'success' => true,
            'message' => 'API is alive',
            'data' => null
        ]);
    });

    Route::get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'message' => 'User fetched successfully',
            'data' => $request->user()
        ]);
    })->middleware('auth:sanctum');
});
