<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    protected $fillable = [
        'name',
        'description',
        'image_url',
        'latitude',
        'longitude',
        'travel_type',
        'is_featured'
    ];
}
