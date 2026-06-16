<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AgentProfile;
use App\Models\User;
use App\Models\Booking;
use OpenApi\Attributes as OA;

class AdminController extends Controller
{
    #[OA\Get(path: "/api/v1/admin/stats", summary: "Statistiques pour le dashboard admin", tags: ["Admin"], security: [["bearerAuth" => []]])]
    #[OA\Response(response: "200", description: "Statistiques globales")]
    #[OA\Response(response: "403", description: "Non autorisé")]
    public function stats(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $totalUsers = User::count();
        $pendingAgents = AgentProfile::where('status', 'en_attente')->count();
        $todayBookings = Booking::whereDate('created_at', today())->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'pending_agents' => $pendingAgents,
                'today_bookings' => $todayBookings
            ]
        ]);
    }

    #[OA\Get(path: "/api/v1/admin/agents-pending", summary: "Liste des agents en attente de validation", tags: ["Admin"], security: [["bearerAuth" => []]])]
    #[OA\Response(response: "200", description: "Liste des agents en attente")]
    #[OA\Response(response: "403", description: "Non autorisé")]
    public function pendingAgents(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $agents = AgentProfile::with('user')->where('status', 'en_attente')->get();

        return response()->json([
            'success' => true,
            'data' => $agents
        ]);
    }

    #[OA\Patch(path: "/api/v1/admin/agents/{id}/validate", summary: "Valider un agent", tags: ["Admin"], security: [["bearerAuth" => []]])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: "200", description: "Agent validé")]
    #[OA\Response(response: "403", description: "Non autorisé")]
    #[OA\Response(response: "404", description: "Agent non trouvé")]
    public function validateAgent(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $profile = AgentProfile::findOrFail($id);
        $profile->update(['status' => 'valide']);

        // Mettre à jour le statut is_verified de l'utilisateur
        if ($profile->user) {
            $profile->user->update(['is_verified' => true]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Agent validé avec succès.'
        ]);
    }

    #[OA\Patch(path: "/api/v1/admin/agents/{id}/refuse", summary: "Refuser un agent", tags: ["Admin"], security: [["bearerAuth" => []]])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: "200", description: "Agent refusé")]
    #[OA\Response(response: "403", description: "Non autorisé")]
    #[OA\Response(response: "404", description: "Agent non trouvé")]
    public function refuseAgent(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $profile = AgentProfile::findOrFail($id);
        $profile->update(['status' => 'refuse']);

        return response()->json([
            'success' => true,
            'message' => 'Agent refusé.'
        ]);
    }

    #[OA\Get(path: "/api/v1/admin/users", summary: "Liste de tous les utilisateurs", tags: ["Admin"], security: [["bearerAuth" => []]])]
    #[OA\Response(response: "200", description: "Liste des utilisateurs")]
    #[OA\Response(response: "403", description: "Non autorisé")]
    public function users(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $users = User::with(['agentProfile', 'reportsReceived'])->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    #[OA\Delete(path: "/api/v1/admin/users/{id}", summary: "Bannir/Supprimer un utilisateur", tags: ["Admin"], security: [["bearerAuth" => []]])]
    #[OA\Response(response: "200", description: "Utilisateur supprimé")]
    #[OA\Response(response: "403", description: "Non autorisé")]
    public function deleteUser(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
        }

        if ($user->role === 'admin') {
            return response()->json(['success' => false, 'message' => 'Impossible de bannir un administrateur'], 403);
        }

        $user->delete();

        return response()->json(['success' => true, 'message' => 'Utilisateur banni avec succès']);
    }

    #[OA\Get(path: "/api/v1/admin/reports", summary: "Lister les signalements", tags: ["Admin"], security: [["bearerAuth" => []]])]
    public function reports(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $reports = \App\Models\Report::with(['reporter', 'reported'])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }
}
