<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ApplicationException;
use App\Models\ExceptionComment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ExceptionComment>
 */
final class ExceptionCommentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<ExceptionComment>
     */
    protected $model = ExceptionComment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'application_exception_id' => ApplicationException::factory(),
            'user_id' => User::factory(),
            'content' => $this->faker->paragraph(),
            'metadata' => [
                'client_ip' => $this->faker->ipv4(),
                'user_agent' => $this->faker->userAgent(),
                'created_from' => $this->faker->randomElement(['web', 'api', 'mobile']),
            ],
            'is_internal' => $this->faker->boolean(30),
        ];
    }

    /**
     * Indicate that the comment is for a specific exception.
     */
    public function forException(ApplicationException $exception): self
    {
        return $this->state(fn (array $attributes): array => [
            'application_exception_id' => $exception->id,
        ]);
    }

    /**
     * Indicate that the comment is by a specific user.
     */
    public function byUser(User $user): self
    {
        return $this->state(fn (array $attributes): array => [
            'user_id' => $user->id,
        ]);
    }

    /**
     * Indicate that the comment is internal.
     */
    public function internal(): self
    {
        return $this->state(fn (array $attributes): array => [
            'is_internal' => true,
        ]);
    }

    /**
     * Indicate that the comment is public.
     */
    public function public(): self
    {
        return $this->state(fn (array $attributes): array => [
            'is_internal' => false,
        ]);
    }

    /**
     * Create a comment with specific content.
     */
    public function withContent(string $content): self
    {
        return $this->state(fn (array $attributes): array => [
            'content' => $content,
        ]);
    }
}
