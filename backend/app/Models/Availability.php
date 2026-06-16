<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Availability extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_profile_id',
        'start_date',
        'end_date',
        'status',
    ];

    public function agentProfile(): BelongsTo
    {
        return $this->belongsTo(AgentProfile::class);
    }
}
