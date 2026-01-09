<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ApplicationKey;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ApplicationKey>
 */
final class ApplicationKeyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ApplicationKey::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->words(3, true),
            'key' => Str::random(64),
            'expires_at' => $this->faker->dateTimeBetween('+1 month', '+1 year'),
            'last_used_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
            'is_enabled' => true,
        ];
    }

    /**
     * Indicate that the application key is expired.
     */
    public function expired(): self
    {
        return $this->state(fn (array $attributes): array => [
            'expires_at' => $this->faker->dateTimeBetween('-1 year', '-1 day'),
        ]);
    }

    /**
     * Indicate that the application key is disabled.
     */
    public function disabled(): self
    {
        return $this->state(fn (array $attributes): array => [
            'is_enabled' => false,
        ]);
    }
}
