<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use App\Models\AgentProfile;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
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
