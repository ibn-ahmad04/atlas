<?php

namespace Database\Factories;

use App\Models\AgentProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AgentProfile>
 */
class AgentProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type'   => fake()->randomElement(['tourisme', 'religieux', 'affaires']),
            'bio'    => fake('fr_FR')->sentence(),
            'status' => 'valide',
        ];
    }

    /**
     * État : profil en attente de validation.
     */
    public function enAttente(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'en_attente',
        ]);
    }

    /**
     * État : profil refusé.
     */
    public function refuse(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'refuse',
        ]);
    }
}
