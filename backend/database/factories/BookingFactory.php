<?php

namespace Database\Factories;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $creneauDebut = Carbon::now()->addDays(rand(10, 60));
        $creneauFin   = (clone $creneauDebut)->addDays(3);

        return [
            'creneau_debut' => $creneauDebut,
            'creneau_fin'   => $creneauFin,
            'message'       => $this->faker->sentence(8),
            'statut'        => $this->faker->randomElement(['en_attente', 'acceptee', 'refusee']),
        ];
    }
}
