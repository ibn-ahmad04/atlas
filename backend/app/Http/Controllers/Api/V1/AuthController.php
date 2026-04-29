<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Exception;

class AuthController extends Controller
{
    /**
     * POST /api/v1/auth/register
     * Crée un nouveau compte et retourne un token Sanctum.
     */
    public function register(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name'     => 'required|string|max:255',
                'email'    => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'role'     => 'required|string|in:voyageur,agent',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation des données.',
                    'data'    => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => $request->role,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Compte créé avec succès.',
                'data'    => [
                    'user'  => new UserResource($user),
                    'token' => $token,
                ],
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'inscription.',
                'data'    => null
            ], 500);
        }
    }

    /**
     * POST /api/v1/auth/login
     * Vérifie les credentials et retourne un token Sanctum + l'utilisateur.
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'email'    => 'required|string|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation des données.',
                    'data'    => $validator->errors()
                ], 422);
            }

            if (! Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Identifiants incorrects.',
                    'data'    => null,
                ], 401);
            }

            /** @var User $user */
            $user  = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie.',
                'data'    => [
                    'user'  => new UserResource($user),
                    'token' => $token,
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la connexion.',
                'data'    => null
            ], 500);
        }
    }

    /**
     * POST /api/v1/auth/logout
     * Révoque le token courant (auth:sanctum requis).
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            /** @var User $user */
            $user = $request->user();
            $user->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie.',
                'data'    => null,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la déconnexion.',
                'data'    => null
            ], 500);
        }
    }

    /**
     * GET /api/v1/auth/me
     * Retourne l'utilisateur actuellement authentifié (auth:sanctum requis).
     */
    public function me(Request $request): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Utilisateur authentifié.',
                'data'    => new UserResource($request->user()),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération du profil.',
                'data'    => null
            ], 500);
        }
    }
}
