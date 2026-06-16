<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\AgentProfile;
use App\Models\Availability;
use App\Models\Notification;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class BookingController extends Controller
{
    #[OA\Post(path: "/api/v1/bookings", summary: "Demander une réservation", tags: ["Réservations"], security: [["bearerAuth" => []]])]
    #[OA\RequestBody(required: true, content: new OA\JsonContent(required: ["agent_profile_id", "slot_start", "slot_end"], properties: [
        new OA\Property(property: "agent_profile_id", type: "integer", example: 1),
        new OA\Property(property: "slot_start", type: "string", format: "date-time", example: "2024-05-01T10:00:00Z"),
        new OA\Property(property: "slot_end", type: "string", format: "date-time", example: "2024-05-01T12:00:00Z"),
        new OA\Property(property: "message", type: "string", example: "Je souhaite visiter le centre historique")
    ]))]
    #[OA\Response(response: "201", description: "Réservation créée")]
    #[OA\Response(response: "403", description: "Accès refusé")]
    #[OA\Response(response: "422", description: "L'agent n'est pas disponible")]
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

    #[OA\Get(path: "/api/v1/bookings", summary: "Liste des réservations de l'utilisateur", tags: ["Réservations"], security: [["bearerAuth" => []]])]
    #[OA\Response(response: "200", description: "Liste des réservations")]
    #[OA\Response(response: "403", description: "Accès refusé")]
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

    #[OA\Post(path: "/api/v1/bookings/{id}/accept", summary: "Accepter une réservation", tags: ["Réservations"], security: [["bearerAuth" => []]])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: "200", description: "Réservation acceptée")]
    #[OA\Response(response: "403", description: "Accès refusé")]
    #[OA\Response(response: "404", description: "Réservation non trouvée")]
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

    #[OA\Post(path: "/api/v1/bookings/{id}/refuse", summary: "Refuser une réservation", tags: ["Réservations"], security: [["bearerAuth" => []]])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: "200", description: "Réservation refusée")]
    #[OA\Response(response: "403", description: "Accès refusé")]
    #[OA\Response(response: "404", description: "Réservation non trouvée")]
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
