<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // Récupérer les avis d'un agent
    public function index($agentId)
    {
        $reviews = Review::with('user:id,name,avatar')
            ->where('agent_id', $agentId)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reviews
        ]);
    }

    // Ajouter un avis
    public function store(Request $request)
    {
        $validated = $request->validate([
            'agent_id' => 'required|exists:users,id',
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();

        // Vérifier que c'est bien une réservation complétée (ou confirmée) pour cet utilisateur et cet agent
        $booking = Booking::where('id', $validated['booking_id'])
            ->where('user_id', $user->id)
            ->where('agent_id', $validated['agent_id'])
            ->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Réservation invalide ou non autorisée pour laisser un avis.'
            ], 403);
        }

        // Vérifier si un avis existe déjà pour ce booking
        if (Review::where('booking_id', $booking->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà laissé un avis pour cette réservation.'
            ], 400);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'agent_id' => $validated['agent_id'],
            'booking_id' => $booking->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Avis ajouté avec succès.',
            'data' => $review->load('user:id,name,avatar')
        ], 201);
    }
}
