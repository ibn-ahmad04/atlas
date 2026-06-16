<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'agent_profile_id',
        'status',
        'message',
        'slot_start',
        'slot_end',
    ];

    public function traveler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function agentProfile(): BelongsTo
    {
        return $this->belongsTo(AgentProfile::class);
    }
}
