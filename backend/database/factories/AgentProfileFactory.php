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
            'type'   => $this->faker->randomElement(['tourisme', 'religieux', 'affaires']),
            'bio'    => $this->faker->sentence(10),
            'status' => 'valide',
        ];
    }

    /**
     * État : en attente de validation.
     */
    public function enAttente(): static
    {
        return $this->state(['status' => 'en_attente']);
    }

    /**
     * État : refusé.
     */
    public function refuse(): static
    {
        return $this->state(['status' => 'refuse']);
    }
}
