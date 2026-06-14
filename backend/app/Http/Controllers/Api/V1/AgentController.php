<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AgentProfile;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AgentController extends Controller
{
    #[OA\Get(path: "/api/v1/agents", summary: "Liste des agents", tags: ["Agents"])]
    #[OA\Parameter(name: "type", in: "query", required: false, schema: new OA\Schema(type: "string"))]
    #[OA\Parameter(name: "language", in: "query", required: false, schema: new OA\Schema(type: "string"))]
    #[OA\Parameter(name: "zone", in: "query", required: false, schema: new OA\Schema(type: "string"))]
    #[OA\Response(response: "200", description: "Liste paginée des agents")]
    public function index(Request $request)
    {
        $query = AgentProfile::with(['user', 'languages', 'zones'])
            ->where('status', 'valide');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('language')) {
            $query->whereHas('languages', function ($q) use ($request) {
                $q->where('language', $request->language);
            });
        }

        if ($request->filled('zone')) {
            $query->whereHas('zones', function ($q) use ($request) {
                $q->where('zone', $request->zone);
            });
        }

        $agents = $query->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Liste des agents',
            'data' => $agents
        ]);
    }

    #[OA\Get(path: "/api/v1/agents/{id}", summary: "Afficher un agent spécifique", tags: ["Agents"])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: "200", description: "Profil complet de l'agent")]
    #[OA\Response(response: "404", description: "Agent non trouvé")]
    public function show($id)
    {
        $agent = AgentProfile::with(['user', 'languages', 'zones', 'availabilities'])
            ->find($id);

        if (!$agent) {
            return response()->json([
                'success' => false,
                'message' => 'Agent non trouvé',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil agent',
            'data' => $agent
        ]);
    }

    #[OA\Put(path: "/api/v1/agents/profile", summary: "Mettre à jour le profil agent", tags: ["Agents"], security: [["bearerAuth" => []]])]
    #[OA\RequestBody(required: true, content: new OA\JsonContent(properties: [
        new OA\Property(property: "bio", type: "string", example: "Je suis un agent passionné"),
        new OA\Property(property: "type", type: "string", enum: ["tourisme", "religieux", "affaires"]),
        new OA\Property(property: "languages", type: "array", items: new OA\Items(type: "string")),
        new OA\Property(property: "zones", type: "array", items: new OA\Items(type: "string"))
    ]))]
    #[OA\Response(response: "200", description: "Profil mis à jour")]
    #[OA\Response(response: "403", description: "Accès refusé")]
    #[OA\Response(response: "404", description: "Profil agent non trouvé")]
    public function updateProfile(Request $request)
    {
        if ($request->user()->role !== 'agent') {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé',
                'data' => null
            ], 403);
        }

        try {
            $agentProfile = AgentProfile::where('user_id', $request->user()->id)->first();

            if (!$agentProfile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profil agent non trouvé',
                    'data' => null
                ], 404);
            }

            $request->validate([
                'bio' => 'nullable|string',
                'type' => 'nullable|string',
                'languages' => 'nullable|array',
                'languages.*' => 'string',
                'zones' => 'nullable|array',
                'zones.*' => 'string',
            ]);

            $agentProfile->update([
                'bio' => $request->bio ?? $agentProfile->bio,
                'type' => $request->type ?? $agentProfile->type,
            ]);

            if ($request->filled('languages')) {
                $agentProfile->languages()->delete();
                foreach ($request->languages as $lang) {
                    $agentProfile->languages()->create(['language' => $lang]);
                }
            }

            if ($request->filled('zones')) {
                $agentProfile->zones()->delete();
                foreach ($request->zones as $zone) {
                    $agentProfile->zones()->create(['zone' => $zone]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Profil mis à jour',
                'data' => $agentProfile->load(['user', 'languages', 'zones'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'data'    => null
            ], 500);
        }
    }
}
