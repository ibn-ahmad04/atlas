<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Champs exposés dans les réponses API.
     * Ne jamais exposer : password, remember_token, deleted_at.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'email'        => $this->email,
            'role'         => $this->role,
            'avatar'       => $this->avatar,
            'bio'          => $this->bio,
            'social_links' => is_string($this->social_links) ? json_decode($this->social_links, true) : $this->social_links,
            'is_verified'  => (bool) $this->is_verified,
            'created_at'   => $this->created_at?->toISOString(),
        ];
    }
}
