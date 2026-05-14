<?php

namespace Database\Factories;

use App\Models\Disponibilite;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Disponibilite>
 */
class DisponibiliteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // date_debut : entre +7j et +30j dans le futur
        $dateDebut = fake()->dateTimeBetween('+7 days', '+30 days');

        // date_fin : date_debut + entre 2 et 7 jours
        $dateFin = (clone $dateDebut)->modify('+' . fake()->numberBetween(2, 7) . ' days');

        return [
            'date_debut' => $dateDebut->format('Y-m-d'),
            'date_fin'   => $dateFin->format('Y-m-d'),
            'statut'     => 'disponible',
        ];
    }
}
