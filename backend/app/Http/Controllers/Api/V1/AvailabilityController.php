<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use App\Models\AgentProfile;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AvailabilityController extends Controller
{
    #[OA\Get(path: "/api/v1/availabilities/{agentId}", summary: "Consulter les disponibilités d'un agent", tags: ["Disponibilités"])]
    #[OA\Parameter(name: "agentId", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: "200", description: "Liste des disponibilités")]
    #[OA\Response(response: "404", description: "Agent non trouvé")]
    public function index($agentId)
    {
        $agent = AgentProfile::find($agentId);

        if (!$agent) {
            return response()->json([
                'success' => false,
                'message' => 'Agent non trouvé',
                'data' => null
            ], 404);
        }

        $availabilities = Availability::where('agent_profile_id', $agentId)->get();

        return response()->json([
            'success' => true,
            'message' => 'Disponibilités de l\'agent',
            'data' => $availabilities
        ]);
    }

    #[OA\Post(path: "/api/v1/availabilities", summary: "Ajouter une disponibilité", tags: ["Disponibilités"])]
    #[OA\RequestBody(required: true, content: new OA\JsonContent(required: ["start_date", "end_date"], properties: [
        new OA\Property(property: "start_date", type: "string", format: "date-time", example: "2024-05-01T10:00:00Z"),
        new OA\Property(property: "end_date", type: "string", format: "date-time", example: "2024-05-01T12:00:00Z")
    ]))]
    #[OA\Response(response: "201", description: "Disponibilité créée")]
    #[OA\Response(response: "403", description: "Accès refusé")]
    #[OA\Response(response: "422", description: "Chevauchement avec un créneau existant")]
    public function store(Request $request)
    {
        if ($request->user()->role !== 'agent') {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé',
                'data' => null
            ], 403);
        }

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $agentProfile = AgentProfile::where('user_id', $request->user()->id)->first();

        if (!$agentProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Profil agent non trouvé',
                'data' => null
            ], 404);
        }

        $conflit = Availability::where('agent_profile_id', $agentProfile->id)
            ->where('start_date', '<', $request->end_date)
            ->where('end_date', '>', $request->start_date)
            ->exists();

        if ($conflit) {
            return response()->json([
                'success' => false,
                'message' => 'Ce créneau chevauche une disponibilité existante',
                'data' => null
            ], 422);
        }

        $availability = Availability::create([
            'agent_profile_id' => $agentProfile->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => 'disponible',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Disponibilité créée',
            'data' => $availability
        ], 201);
    }

    #[OA\Delete(path: "/api/v1/availabilities/{id}", summary: "Supprimer une disponibilité", tags: ["Disponibilités"])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: "200", description: "Disponibilité supprimée")]
    #[OA\Response(response: "403", description: "Action non autorisée")]
    #[OA\Response(response: "404", description: "Disponibilité non trouvée")]
    public function destroy(Request $request, $id)
    {
        $agentProfile = AgentProfile::where('user_id', $request->user()->id)->first();

        $availability = Availability::find($id);

        if (!$availability) {
            return response()->json([
                'success' => false,
                'message' => 'Disponibilité non trouvée',
                'data' => null
            ], 404);
        }

        if (!$agentProfile || $availability->agent_profile_id !== $agentProfile->id) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée',
                'data' => null
            ], 403);
        }

        $availability->delete();

        return response()->json([
            'success' => true,
            'message' => 'Disponibilité supprimée',
            'data' => null
        ]);
    }
}
