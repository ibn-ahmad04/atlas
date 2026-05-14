<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AgentProfile;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    public function index(Request $request)
    {
        $query = AgentProfile::with(['user', 'agentLanguages', 'agentZones'])
            ->where('status', 'valide');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('language')) {
            $query->whereHas('agentLanguages', function ($q) use ($request) {
                $q->where('language', $request->language);
            });
        }

        if ($request->filled('zone')) {
            $query->whereHas('agentZones', function ($q) use ($request) {
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

    public function show($id)
    {
        $agent = AgentProfile::with(['user', 'agentLanguages', 'agentZones', 'availabilities'])
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

    public function updateProfile(Request $request)
    {
        if ($request->user()->role !== 'agent') {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé',
                'data' => null
            ], 403);
        }

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
            $agentProfile->agentLanguages()->delete();
            foreach ($request->languages as $lang) {
                $agentProfile->agentLanguages()->create(['language' => $lang]);
            }
        }

        if ($request->filled('zones')) {
            $agentProfile->agentZones()->delete();
            foreach ($request->zones as $zone) {
                $agentProfile->agentZones()->create(['zone' => $zone]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour',
            'data' => $agentProfile->load(['user', 'agentLanguages', 'agentZones'])
        ]);
    }
}
