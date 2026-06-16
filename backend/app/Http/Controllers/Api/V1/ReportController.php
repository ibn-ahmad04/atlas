<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ReportController extends Controller
{
    #[OA\Post(path: "/api/v1/reports", summary: "Signaler un utilisateur", tags: ["Signalements"], security: [["bearerAuth" => []]])]
    #[OA\Response(response: "201", description: "Signalement envoyé")]
    #[OA\Response(response: "400", description: "Requête invalide")]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reported_id' => 'required|exists:users,id',
            'reason' => 'required|string|max:255',
            'details' => 'nullable|string',
        ]);

        if ($request->user()->id == $validated['reported_id']) {
            return response()->json(['success' => false, 'message' => 'Vous ne pouvez pas vous signaler vous-même'], 400);
        }

        $report = Report::create([
            'reporter_id' => $request->user()->id,
            'reported_id' => $validated['reported_id'],
            'reason' => $validated['reason'],
            'details' => $validated['details'] ?? null,
            'status' => 'pending'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Signalement envoyé avec succès. Un administrateur l\'examinera.',
            'data' => $report
        ], 201);
    }
}
