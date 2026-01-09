<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Application;
use App\Models\ExceptionTag;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ExceptionTag>
 */
final class ExceptionTagFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<ExceptionTag>
     */
    protected $model = ExceptionTag::class;

    /**
     * Create a common set of predefined tags.
     *
     * @return array<ExceptionTag>
     */
    public static function createCommonTags(Application $application): array
    {
        $tags = [];
        $commonTags = [
            ['name' => 'bug', 'color' => '#EF4444', 'description' => 'A bug that needs to be fixed'],
            ['name' => 'feature', 'color' => '#10B981', 'description' => 'Related to a feature implementation'],
            ['name' => 'critical', 'color' => '#7F1D1D', 'description' => 'Critical issue that needs immediate attention'],
            ['name' => 'performance', 'color' => '#FBBF24', 'description' => 'Performance related issue'],
            ['name' => 'security', 'color' => '#B91C1C', 'description' => 'Security related issue'],
            ['name' => 'database', 'color' => '#1D4ED8', 'description' => 'Database related issue'],
            ['name' => 'ui', 'color' => '#8B5CF6', 'description' => 'User interface related issue'],
            ['name' => 'api', 'color' => '#059669', 'description' => 'API related issue'],
        ];

        foreach ($commonTags as $tagData) {
            $tags[] = self::new()->create([
                'application_id' => $application->id,
                'name' => $tagData['name'],
                'color' => $tagData['color'],
                'description' => $tagData['description'],
            ]);
        }

        return $tags;
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'application_id' => Application::factory(),
            'name' => $this->faker->unique()->word(),
            'color' => $this->faker->hexColor(),
            'description' => $this->faker->sentence(),
        ];
    }

    /**
     * Indicate that the tag is for a specific application.
     */
    public function forApplication(Application $application): self
    {
        return $this->state(fn (array $attributes): array => [
            'application_id' => $application->id,
        ]);
    }

    /**
     * Create a tag with a specific name.
     */
    public function withName(string $name): self
    {
        return $this->state(fn (array $attributes): array => [
            'name' => $name,
        ]);
    }

    /**
     * Create a tag with a specific color.
     */
    public function withColor(string $color): self
    {
        return $this->state(fn (array $attributes): array => [
            'color' => $color,
        ]);
    }
}
