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
        Schema::create('application_exceptions', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('application_id')->index()->constrained();
            $table->string('type')->index()->nullable();
            $table->string('message')->index()->nullable();
            $table->string('file')->index()->nullable();
            $table->unsignedInteger('line')->index()->nullable();
            $table->text('trace')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_exceptions');
    }
};
