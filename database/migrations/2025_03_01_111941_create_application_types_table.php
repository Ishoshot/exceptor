<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('application_types', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('name')->index();
            $table->string('slug')->index();
            $table->string('color')->nullable();
            $table->timestamps();

            $table->unique(['name', 'slug']);
        });

        DB::table('application_types')->insert([
            ['id' => Str::uuid(), 'name' => 'Laravel', 'slug' => 'laravel', 'color' => '#FF2D20', 'created_at' => now(), 'updated_at' => now()],
            ['id' => Str::uuid(), 'name' => 'Node.js', 'slug' => 'node-js', 'color' => '#68A063', 'created_at' => now(), 'updated_at' => now()],
            ['id' => Str::uuid(), 'name' => 'Python', 'slug' => 'python', 'color' => '#306998', 'created_at' => now(), 'updated_at' => now()],
            ['id' => Str::uuid(), 'name' => 'Ruby', 'slug' => 'ruby', 'color' => '#CC342D', 'created_at' => now(), 'updated_at' => now()],
            ['id' => Str::uuid(), 'name' => 'Java', 'slug' => 'java', 'color' => '#5382A1', 'created_at' => now(), 'updated_at' => now()],
            ['id' => Str::uuid(), 'name' => 'C#', 'slug' => 'c-sharp', 'color' => '#68217A', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_types');
    }
};
