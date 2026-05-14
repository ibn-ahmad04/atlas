<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\AgentProfile;
use App\Models\Availability;
use App\Models\Notification;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        if ($request->user()->role !== 'voyageur') {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé',
                'data' => null
            ], 403);
        }

        $request->validate([
            'agent_profile_id' => 'required|exists:agent_profiles,id',
            'creneau_debut' => 'required|date',
            'creneau_fin' => 'required|date|after:creneau_debut',
            'message' => 'nullable|string',
        ]);

        $disponible = Availability::where('agent_profile_id', $request->agent_profile_id)
            ->where('statut', 'disponible')
            ->where('date_debut', '<=', $request->creneau_debut)
            ->where('date_fin', '>=', $request->creneau_fin)
            ->exists();

        if (!$disponible) {
            return response()->json([
                'success' => false,
                'message' => 'L\'agent n\'est pas disponible sur ce créneau',
                'data' => null
            ], 422);
        }

        $booking = Booking::create([
            'voyageur_id' => $request->user()->id,
            'agent_profile_id' => $request->agent_profile_id,
            'statut' => 'en_attente',
            'message' => $request->message,
            'creneau_debut' => $request->creneau_debut,
            'creneau_fin' => $request->creneau_fin,
        ]);

        $agentProfile = AgentProfile::find($request->agent_profile_id);

        Notification::create([
            'user_id' => $agentProfile->user_id,
            'type' => 'new_booking',
            'message' => 'Vous avez reçu une nouvelle demande',
            'lu' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Demande de réservation envoyée',
            'data' => $booking
        ], 201);
    }

    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'voyageur') {
            $bookings = Booking::with(['agentProfile.user'])
                ->where('voyageur_id', $user->id)
                ->get();
        } elseif ($user->role === 'agent') {
            $agentProfile = AgentProfile::where('user_id', $user->id)->first();

            if (!$agentProfile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profil agent non trouvé',
                    'data' => null
                ], 404);
            }

            $bookings = Booking::with(['voyageur'])
                ->where('agent_profile_id', $agentProfile->id)
                ->get();
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé',
                'data' => null
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Liste des réservations',
            'data' => $bookings
        ]);
    }

    public function accept(Request $request, $id)
    {
        if ($request->user()->role !== 'agent') {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé',
                'data' => null
            ], 403);
        }

        $agentProfile = AgentProfile::where('user_id', $request->user()->id)->first();
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée',
                'data' => null
            ], 404);
        }

        if (!$agentProfile || $booking->agent_profile_id !== $agentProfile->id) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée',
                'data' => null
            ], 403);
        }

        $booking->update(['statut' => 'acceptee']);

        Notification::create([
            'user_id' => $booking->voyageur_id,
            'type' => 'booking_accepted',
            'message' => 'Votre demande a été acceptée',
            'lu' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Réservation acceptée',
            'data' => $booking
        ]);
    }

    public function refuse(Request $request, $id)
    {
        if ($request->user()->role !== 'agent') {
            return response()->json([
                'success' => false,
                'message' => 'Accès refusé',
                'data' => null
            ], 403);
        }

        $agentProfile = AgentProfile::where('user_id', $request->user()->id)->first();
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation non trouvée',
                'data' => null
            ], 404);
        }

        if (!$agentProfile || $booking->agent_profile_id !== $agentProfile->id) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée',
                'data' => null
            ], 403);
        }

        $booking->update(['statut' => 'refusee']);

        Notification::create([
            'user_id' => $booking->voyageur_id,
            'type' => 'booking_refused',
            'message' => 'Votre demande a été refusée',
            'lu' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Réservation refusée',
            'data' => $booking
        ]);
    }
}
