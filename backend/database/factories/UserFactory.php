<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'              => fake()->name(),
            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => Hash::make('password'),
            'role'              => 'voyageur',
            'remember_token'    => Str::random(10),
        ];
    }

    /**
     * État : voyageur (rôle par défaut).
     */
    public function voyageur(): static
    {
        return $this->state(['role' => 'voyageur']);
    }

    /**
     * État : agent.
     */
    public function agent(): static
    {
        return $this->state(['role' => 'agent']);
    }

    /**
     * État : admin.
     */
    public function admin(): static
    {
        return $this->state(['role' => 'admin']);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
