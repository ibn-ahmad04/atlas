<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class AvailabilityFactory extends Factory
{
    public function definition(): array
    {
        $start = Carbon::now()->addDays(rand(7,30));
        $end = (clone $start)->addDays(rand(2,7));

        return [
            'start_date' => $start->toDateString(),
            'end_date'   => $end->toDateString(),
            'status'     => 'disponible',
        ];
    }
}
