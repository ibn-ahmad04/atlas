<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request)
{
    $data = $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8'
    ]);

    $user = \App\Models\User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => bcrypt($data['password']),
    ]);

    return response()->json([
        'message' => 'register ok',
        'user' => $user
    ]);
}

    public function login(Request $request)
{
    $data = $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    if (!auth()->attempt($data)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    $user = auth()->user();

    $token = $user->createToken('atlas_token')->plainTextToken;

    return response()->json([
        'message' => 'login ok',
        'token' => $token,
        'user' => $user
    ]);
}

   public function me(Request $request)
{
    $user = $request->user();

    if (!$user) {
        return response()->json([
            'message' => 'Unauthenticated'
        ], 401);
    }

    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
    ]);
}

    public function logout(Request $request) {
        return response()->json(['message' => 'logout ok']);
    }
}