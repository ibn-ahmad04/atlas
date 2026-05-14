<?php

namespace Database\Factories;

use App\Models\Demande;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Demande>
 */
class DemandeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // creneau_debut : date future aléatoire
        $creneauDebut = fake()->dateTimeBetween('+1 day', '+60 days');

        // creneau_fin : creneau_debut + 3 jours
        $creneauFin = (clone $creneauDebut)->modify('+3 days');

        return [
            'creneau_debut' => $creneauDebut->format('Y-m-d H:i:s'),
            'creneau_fin'   => $creneauFin->format('Y-m-d H:i:s'),
            'message'       => fake('fr_FR')->sentence(),
            'statut'        => fake()->randomElement(['en_attente', 'acceptee', 'refusee']),
        ];
    }
}
