<?php

namespace Database\Factories;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    public function definition(): array
    {
        $start = Carbon::now()->addDays(rand(10,60));
        $end = (clone $start)->addDays(3);
        return [
          'slot_start' => $start,
          'slot_end'   => $end,
          'message'    => fake()->sentence(8),
          'status'     => fake()->randomElement(['en_attente','acceptee','refusee']),
        ];
    }
}
