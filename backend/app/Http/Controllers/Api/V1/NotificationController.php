<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class NotificationController extends Controller
{
    #[OA\Get(path: "/api/v1/notifications", summary: "Liste des notifications non lues", tags: ["Notifications"])]
    #[OA\Response(response: "200", description: "Liste des notifications")]
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Notifications non lues',
            'data' => $notifications
        ]);
    }

    #[OA\Patch(path: "/api/v1/notifications/{id}/read", summary: "Marquer une notification comme lue", tags: ["Notifications"])]
    #[OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: "200", description: "Notification lue")]
    #[OA\Response(response: "403", description: "Accès refusé")]
    #[OA\Response(response: "404", description: "Notification non trouvée")]
    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification non trouvée',
                'data' => null
            ], 404);
        }

        if ($notification->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Action non autorisée',
                'data' => null
            ], 403);
        }

        $notification->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Notification marquée comme lue',
            'data' => $notification
        ]);
    }
}
