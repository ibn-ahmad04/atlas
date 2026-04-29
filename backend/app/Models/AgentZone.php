<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgentZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_profile_id',
        'zone',
    ];

    // ─── Relations ───────────────────────────────────────────────────────────

    public function agentProfile(): BelongsTo
    {
        return $this->belongsTo(AgentProfile::class);
    }
}
