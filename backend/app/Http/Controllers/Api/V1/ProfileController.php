<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\UserResource;
use OpenApi\Attributes as OA;

class ProfileController extends Controller
{
    #[OA\Post(path: "/api/v1/profile/info", summary: "Mettre à jour les informations du profil", tags: ["Profil"])]
    #[OA\RequestBody(required: true, content: new OA\JsonContent(properties: [
        new OA\Property(property: "name", type: "string"),
        new OA\Property(property: "email", type: "string", format: "email"),
        new OA\Property(property: "password", type: "string", format: "password"),
        new OA\Property(property: "password_confirmation", type: "string", format: "password")
    ]))]
    #[OA\Response(response: "200", description: "Informations mises à jour")]
    public function updateInfo(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:8|confirmed',
            'bio' => 'nullable|string',
            'social_links' => 'nullable|array',
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }
        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        if (array_key_exists('bio', $validated)) {
            $user->bio = $validated['bio'];
        }
        if (array_key_exists('social_links', $validated)) {
            $user->social_links = json_encode($validated['social_links']);
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'data' => new UserResource($user)
        ]);
    }

    #[OA\Post(path: "/api/v1/profile/avatar", summary: "Mettre à jour l'avatar", tags: ["Profil"])]
    #[OA\Response(response: "200", description: "Avatar mis à jour")]
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // Max 5MB
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Store new avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            
            $user->avatar = $path;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Avatar mis à jour avec succès',
                'data' => new UserResource($user)
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Aucune image fournie',
            'data' => null
        ], 400);
    }
}
