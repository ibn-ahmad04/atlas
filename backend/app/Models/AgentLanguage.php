<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgentLanguage extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_profile_id',
        'language',
    ];

    // ─── Relations ───────────────────────────────────────────────────────────

    public function agentProfile(): BelongsTo
    {
        return $this->belongsTo(AgentProfile::class);
    }
}
