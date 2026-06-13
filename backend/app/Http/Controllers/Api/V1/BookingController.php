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
            'slot_start' => 'required|date',
            'slot_end' => 'required|date|after:slot_start',
            'message' => 'nullable|string',
        ]);

        $disponible = Availability::where('agent_profile_id', $request->agent_profile_id)
            ->where('status', 'disponible')
            ->where('start_date', '<=', $request->slot_start)
            ->where('end_date', '>=', $request->slot_end)
            ->exists();

        if (!$disponible) {
            return response()->json([
                'success' => false,
                'message' => 'L\'agent n\'est pas disponible sur ce créneau',
                'data' => null
            ], 422);
        }

        $booking = Booking::create([
            'user_id'          => $request->user()->id,
            'agent_profile_id' => $request->agent_profile_id,
            'slot_start'       => $request->slot_start,
            'slot_end'         => $request->slot_end,
            'status'           => 'en_attente',
            'message'          => $request->message,
        ]);

        $agentProfile = AgentProfile::find($request->agent_profile_id);

        Notification::create([
            'user_id'  => $agentProfile->user_id,
            'type'     => 'new_booking',
            'message'  => 'Vous avez reçu une nouvelle demande',
            'is_read'  => false,
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
                ->where('user_id', $user->id)
                ->latest()->get();
        } elseif ($user->role === 'agent') {
            $agentProfile = AgentProfile::where('user_id', $user->id)->first();

            if (!$agentProfile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profil agent non trouvé',
                    'data' => null
                ], 404);
            }

            $bookings = Booking::with(['traveler'])
                ->whereHas('agentProfile', fn($q) =>
                    $q->where('user_id', $user->id))
                ->latest()->get();
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

        $booking->update(['status' => 'acceptee']);

        Notification::create([
            'user_id'  => $booking->user_id,
            'type'     => 'booking_accepted',
            'message'  => 'Votre demande a été acceptée',
            'is_read'  => false,
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

        $booking->update(['status' => 'refusee']);

        Notification::create([
            'user_id'  => $booking->user_id,
            'type'     => 'booking_refused',
            'message'  => 'Votre demande a été refusée',
            'is_read'  => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Réservation refusée',
            'data' => $booking
        ]);
    }
}
