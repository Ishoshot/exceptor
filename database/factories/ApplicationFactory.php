<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ApplicationType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
final class ApplicationFactory extends Factory
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
            'user_id' => User::factory(),
            'application_type_id' => ApplicationType::inRandomOrder()->first()->id,
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->sentence,
            'url' => $this->faker->url,
            'repository' => $this->faker->url,
        ];
    }
}
