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
        Schema::create('exception_occurrences', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('application_exception_id')->index()->constrained('application_exceptions')->cascadeOnDelete();
            $table->jsonb('request_data')->nullable();
            $table->jsonb('user_data')->nullable();
            $table->jsonb('environment_data')->nullable();
            $table->jsonb('breadcrumbs')->nullable();
            $table->jsonb('metadata')->nullable();
            $table->timestamp('occurred_at');
            $table->timestamps();

            // Create index for efficient querying by time
            $table->index('occurred_at');
            $table->index(['application_exception_id', 'occurred_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exception_occurrences');
    }
};
