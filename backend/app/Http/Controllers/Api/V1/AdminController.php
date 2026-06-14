<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AgentProfile;
use App\Models\User;
use App\Models\Booking;

class AdminController extends Controller
{
    // GET /api/v1/admin/stats
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

    // GET /api/v1/admin/agents-pending
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

    // PATCH /api/v1/admin/agents/{id}/validate
    public function validateAgent(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $profile = AgentProfile::findOrFail($id);
        $profile->update(['status' => 'valide']);

        return response()->json([
            'success' => true,
            'message' => 'Agent validé avec succès.'
        ]);
    }

    // PATCH /api/v1/admin/agents/{id}/refuse
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

    // GET /api/v1/admin/users
    public function users(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $users = User::with('agentProfile')->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }
}
