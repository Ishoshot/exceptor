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
        Schema::create('exception_comments', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('application_exception_id')->index()->constrained('application_exceptions')->cascadeOnDelete();
            $table->foreignUuid('user_id')->index()->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->jsonb('metadata')->nullable();
            $table->boolean('is_internal')->default(false);
            $table->timestamps();

            // Create index for efficient querying
            $table->index(['application_exception_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exception_comments');
    }
};
