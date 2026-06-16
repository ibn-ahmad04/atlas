<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'agent_id',
        'description',
        'image_url',
    ];

    public function agentProfile()
    {
        return $this->belongsTo(AgentProfile::class, 'agent_id');
    }

    public function taggedUsers()
    {
        return $this->belongsToMany(User::class, 'post_user', 'post_id', 'user_id')->withTimestamps();
    }
}
