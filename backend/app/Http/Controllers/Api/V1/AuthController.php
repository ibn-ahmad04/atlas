<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Http\Requests\Api\V1\Auth\LoginRequest;

#[OA\Info(version: "1.0.0", title: "Atlas API", description: "Documentation interactive de l'API Atlas")]
#[OA\Server(url: "http://localhost:8000")]
#[OA\SecurityScheme(securityScheme: "bearerAuth", type: "http", scheme: "bearer")]
class AuthController extends Controller
{
    #[OA\Post(path: "/api/v1/auth/register", summary: "Inscription d'un utilisateur", tags: ["Authentification"])]
    #[OA\RequestBody(required: true, content: new OA\JsonContent(required: ["name", "email", "password", "password_confirmation", "role"], properties: [
        new OA\Property(property: "name", type: "string", example: "Jean Dupont"),
        new OA\Property(property: "email", type: "string", format: "email", example: "jean@example.com"),
        new OA\Property(property: "password", type: "string", format: "password", example: "password123"),
        new OA\Property(property: "password_confirmation", type: "string", format: "password", example: "password123"),
        new OA\Property(property: "role", type: "string", enum: ["voyageur", "agent"])
    ]))]
    #[OA\Response(response: "201", description: "Inscription réussie")]
    #[OA\Response(response: "400", description: "Erreur de validation")]
    public function register(RegisterRequest $request)
    {
        try {
            $validated = $request->validated();

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
            ]);

            $token = $user->createToken('atlas_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'user' => new UserResource($user),
                    'token' => $token,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage(),
                'data' => null,
            ], 400);
        }
    }

    #[OA\Post(path: "/api/v1/auth/login", summary: "Connexion d'un utilisateur", tags: ["Authentification"])]
    #[OA\RequestBody(required: true, content: new OA\JsonContent(required: ["email", "password"], properties: [
        new OA\Property(property: "email", type: "string", format: "email", example: "jean@example.com"),
        new OA\Property(property: "password", type: "string", format: "password", example: "password123")
    ]))]
    #[OA\Response(response: "200", description: "Connexion réussie avec Token")]
    #[OA\Response(response: "401", description: "Identifiants invalides")]
    public function login(LoginRequest $request)
    {
        try {
            $validated = $request->validated();

            if (!Auth::attempt($validated)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials',
                    'data' => null,
                ], 401);
            }

            $user = Auth::user();
            $token = $user->createToken('atlas_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => new UserResource($user),
                    'token' => $token,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage(),
                'data' => null,
            ], 400);
        }
    }

    #[OA\Post(path: "/api/v1/auth/logout", summary: "Déconnexion (Révocation du token)", tags: ["Authentification"])]
    #[OA\Response(response: "200", description: "Déconnexion réussie")]
    #[OA\Response(response: "401", description: "Non autorisé")]
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout successful',
                'data' => null,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed: ' . $e->getMessage(),
                'data' => null,
            ], 400);
        }
    }

    #[OA\Get(path: "/api/v1/auth/me", summary: "Récupérer l'utilisateur connecté", tags: ["Authentification"])]
    #[OA\Response(response: "200", description: "Informations de l'utilisateur")]
    #[OA\Response(response: "401", description: "Non autorisé")]
    public function me(Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'User data retrieved',
                'data' => new UserResource($request->user()),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user data: ' . $e->getMessage(),
                'data' => null,
            ], 400);
        }
    }
}
