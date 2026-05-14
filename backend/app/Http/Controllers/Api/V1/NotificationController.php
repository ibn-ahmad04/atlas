<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->where('lu', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Notifications non lues',
            'data' => $notifications
        ]);
    }

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

        $notification->update(['lu' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Notification marquée comme lue',
            'data' => $notification
        ]);
    }
}
