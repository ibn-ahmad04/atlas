<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use OpenApi\Attributes as OA;

class DestinationController extends Controller
{
    #[OA\Get(path: "/api/v1/destinations", summary: "Liste des destinations", tags: ["Destinations"])]
    #[OA\Response(response: "200", description: "Liste des destinations")]
    public function index()
    {
        $destinations = Destination::all();

        foreach ($destinations as $dest) {
            // Count bookings for agents that have a zone matching this destination's name
            // Considering 'en_attente' and 'acceptee' as active requests
            $dest->active_requests = \App\Models\Booking::whereHas('agentProfile.zones', function($q) use ($dest) {
                $q->where('zone', $dest->name);
            })->whereIn('status', ['en_attente', 'acceptee'])->count();
        }

        return response()->json([
            'success' => true,
            'data' => $destinations
        ]);
    }

    #[OA\Post(path: "/api/v1/admin/destinations", summary: "Ajouter une destination", tags: ["Admin", "Destinations"], security: [["bearerAuth" => []]])]
    #[OA\Response(response: "201", description: "Destination ajoutée")]
    #[OA\Response(response: "403", description: "Non autorisé")]
    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:destinations,name',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'travel_type' => 'nullable|string|in:touristique,omra,hajj,aventure',
        ]);

        $destination = new Destination();
        $destination->name = $validated['name'];
        if (isset($validated['description'])) {
            $destination->description = $validated['description'];
        }
        if (isset($validated['travel_type'])) {
            $destination->travel_type = $validated['travel_type'];
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('destinations', 'public');
            $destination->image_url = $path;
        }

        // Automatic Geocoding with Nominatim
        try {
            $response = Http::withHeaders([
                'User-Agent' => 'ProjetAtlas/1.0'
            ])->get('https://nominatim.openstreetmap.org/search', [
                'q' => $validated['name'],
                'format' => 'json',
                'limit' => 1
            ]);

            if ($response->successful() && !empty($response->json())) {
                $data = $response->json()[0];
                $destination->latitude = $data['lat'];
                $destination->longitude = $data['lon'];
            }
        } catch (\Exception $e) {
            // Log error, continue saving without coordinates
            \Illuminate\Support\Facades\Log::error("Geocoding failed for destination: " . $validated['name'] . " - " . $e->getMessage());
        }

        $destination->save();

        return response()->json([
            'success' => true,
            'message' => 'Destination ajoutée',
            'data' => $destination
        ], 201);
    }

    #[OA\Delete(path: "/api/v1/admin/destinations/{id}", summary: "Supprimer une destination", tags: ["Admin", "Destinations"], security: [["bearerAuth" => []]])]
    #[OA\Response(response: "200", description: "Destination supprimée")]
    #[OA\Response(response: "403", description: "Non autorisé")]
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        $destination = Destination::find($id);
        if (!$destination) {
            return response()->json(['success' => false, 'message' => 'Destination non trouvée'], 404);
        }

        if ($destination->image_url && Storage::disk('public')->exists($destination->image_url)) {
            Storage::disk('public')->delete($destination->image_url);
        }

        $destination->delete();

        return response()->json(['success' => true, 'message' => 'Destination supprimée']);
    }
}
