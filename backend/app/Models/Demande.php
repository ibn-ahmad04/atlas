<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Demande extends Model
{
    use HasFactory;

    protected $fillable = [
        'voyageur_id',
        'agent_profile_id',
        'statut',
        'message',
        'creneau_debut',
        'creneau_fin',
    ];

    protected function casts(): array
    {
        return [
            'creneau_debut' => 'datetime',
            'creneau_fin'   => 'datetime',
        ];
    }

    // ─── Relations ───────────────────────────────────────────────────────────

    public function voyageur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'voyageur_id');
    }

    public function agentProfile(): BelongsTo
    {
        return $this->belongsTo(AgentProfile::class);
    }
}
