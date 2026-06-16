<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\AgentVerificationRequest;

class AgentVerificationController extends Controller
{
    public function requestVerification(Request $request)
    {
        $user = $request->user();

        // Si l'utilisateur n'est pas un agent ou est déjà vérifié
        if ($user->role !== 'agent') {
            return response()->json(['success' => false, 'message' => 'Non autorisé.'], 403);
        }

        if ($user->is_verified) {
            return response()->json(['success' => false, 'message' => 'Vous êtes déjà vérifié.'], 400);
        }

        // Mettre à jour le statut du profil à 'en_attente'
        if ($user->agentProfile) {
            $user->agentProfile->status = 'en_attente';
            $user->agentProfile->save();
        }

        // Envoi du mail
        // On suppose que l'admin est support@atlas.com (ou configuration .env)
        try {
            Mail::to('support@atlas.com')->send(new AgentVerificationRequest($user));
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erreur lors de l\'envoi de la demande.'], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Demande de vérification envoyée. Un conseiller vous contactera par email pour fixer un rendez-vous.'
        ]);
    }
}
