<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ApplicationException;
use App\Models\ExceptionOccurrence;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ExceptionOccurrence>
 */
final class ExceptionOccurrenceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<ExceptionOccurrence>
     */
    protected $model = ExceptionOccurrence::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'application_exception_id' => ApplicationException::factory(),
            'request_data' => [
                'url' => $this->faker->url(),
                'method' => $this->faker->randomElement(['GET', 'POST', 'PUT', 'DELETE']),
                'headers' => [
                    'User-Agent' => $this->faker->userAgent(),
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ],
                'ip' => $this->faker->ipv4(),
                'query' => [],
                'body' => [],
            ],
            'user_data' => [
                'id' => $this->faker->uuid(),
                'email' => $this->faker->email(),
                'name' => $this->faker->name(),
            ],
            'environment_data' => [
                'php_version' => $this->faker->semver(),
                'framework_version' => '11.0.0',
                'server' => $this->faker->randomElement(['Apache', 'Nginx', 'Caddy']),
                'os' => $this->faker->randomElement(['Linux', 'Windows', 'macOS']),
            ],
            'breadcrumbs' => $this->generateBreadcrumbs(),
            'metadata' => [
                'memory_usage' => $this->faker->numberBetween(10, 100),
                'cpu_usage' => $this->faker->numberBetween(1, 100),
                'duration' => $this->faker->numberBetween(10, 1000),
            ],
            'occurred_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }

    /**
     * Generate random breadcrumbs.
     *
     * @return array<int, array<string, mixed>>
     */
    private function generateBreadcrumbs(): array
    {
        $breadcrumbs = [];
        $count = $this->faker->numberBetween(3, 10);

        for ($i = 0; $i < $count; $i++) {
            $breadcrumbs[] = [
                'type' => $this->faker->randomElement(['info', 'query', 'error', 'http']),
                'category' => $this->faker->randomElement(['database', 'http', 'auth', 'cache']),
                'message' => $this->faker->sentence(),
                'data' => [
                    'key' => $this->faker->word(),
                    'value' => $this->faker->word(),
                ],
                'timestamp' => $this->faker->dateTimeBetween('-1 hour', 'now')->format('Y-m-d H:i:s'),
            ];
        }

        return $breadcrumbs;
    }
}
