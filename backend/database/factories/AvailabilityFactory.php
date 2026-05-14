<?php

namespace Database\Factories;

use App\Models\Availability;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Availability>
 */
class AvailabilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dateDebut = Carbon::now()->addDays(rand(7, 30));
        $dateFin   = (clone $dateDebut)->addDays(rand(2, 7));

        return [
            'date_debut' => $dateDebut->toDateString(),
            'date_fin'   => $dateFin->toDateString(),
            'statut'     => 'disponible',
        ];
    }
}
