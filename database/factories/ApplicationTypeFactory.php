<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ApplicationType>
 */
final class ApplicationTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->randomElement([
            'Laravel',
            'Node.js',
            'C#',
            'Python',
            'Ruby',
            'Java',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'color' => $this->faker->hexColor,
        ];
    }
}
