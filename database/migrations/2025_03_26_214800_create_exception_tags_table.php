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
        Schema::create('exception_tags', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('application_id')->index()->constrained()->cascadeOnDelete();
            $table->string('name')->index();
            $table->string('color', 20)->default('#6366F1');
            $table->text('description')->nullable();
            $table->timestamps();

            // Ensure tag names are unique per application
            $table->unique(['application_id', 'name']);
        });

        Schema::create('application_exception_tag', function (Blueprint $table): void {
            $table->foreignUuid('application_exception_id')->index()->constrained('application_exceptions')->cascadeOnDelete();
            $table->foreignUuid('exception_tag_id')->index()->constrained('exception_tags')->cascadeOnDelete();
            $table->timestamps();

            // Ensure each tag is only applied once to an exception
            $table->primary(['application_exception_id', 'exception_tag_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_exception_tag');
        Schema::dropIfExists('exception_tags');
    }
};
