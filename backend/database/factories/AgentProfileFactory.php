<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AgentProfileFactory extends Factory
{
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(['tourisme','religieux','affaires']),
            'bio' => fake()->sentence(10),
            'status' => 'valide',
        ];
    }

    public function enAttente(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'en_attente',
        ]);
    }

    public function refuse(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'refuse',
        ]);
    }
}
