<?php

declare(strict_types=1);

use App\Enums\ExceptionEnvironment;
use App\Enums\ExceptionLevel;
use App\Enums\ExceptionSource;
use App\Enums\ExceptionStatus;
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
        Schema::table('application_exceptions', function (Blueprint $table): void {
            // Rename the existing 'type' column to 'exception_class' for clarity
            $table->renameColumn('type', 'exception_class');

            // Add new columns for enhanced exception tracking
            $table->string('fingerprint')->index()->after('line')->nullable();
            $table->string('level')->after('fingerprint')->default(ExceptionLevel::Error->value);
            $table->string('status')->after('level')->default(ExceptionStatus::Unresolved->value);
            $table->string('environment')->after('status')->default(ExceptionEnvironment::Production->value);
            $table->string('source')->after('environment')->default(ExceptionSource::Backend->value);
            $table->integer('code')->after('source')->nullable();
            $table->integer('occurrence_count')->after('code')->default(1);
            $table->timestamp('first_seen_at')->after('occurrence_count')->nullable();
            $table->timestamp('last_seen_at')->after('first_seen_at')->nullable();
            $table->timestamp('resolved_at')->after('last_seen_at')->nullable();

            // Add JSON columns for context data
            $table->jsonb('request_data')->after('trace')->nullable();
            $table->jsonb('user_data')->after('request_data')->nullable();
            $table->jsonb('environment_data')->after('user_data')->nullable();
            $table->jsonb('breadcrumbs')->after('environment_data')->nullable();
            $table->jsonb('previous_exception')->after('breadcrumbs')->nullable();
            $table->jsonb('metadata')->after('previous_exception')->nullable();

            // Add full-text search capabilities for PostgreSQL
            $table->text('search_vector')->after('metadata')->nullable();

            // Add columns for tracking and organization
            $table->string('tags')->after('search_vector')->nullable();
            $table->text('notes')->after('tags')->nullable();
            $table->uuid('resolved_by')->after('notes')->nullable();

            // Create indexes for common query patterns
            $table->index(['application_id', 'status']);
            $table->index(['application_id', 'level']);
            $table->index(['application_id', 'environment']);
            $table->index(['application_id', 'source']);
            $table->index(['application_id', 'fingerprint']);
            $table->index(['first_seen_at', 'last_seen_at']);
        });

        // Add PostgreSQL-specific full-text search index
        DB::statement('CREATE INDEX application_exceptions_search_idx ON application_exceptions USING GIN(to_tsvector(\'english\', coalesce(message, \'\') || \' \' || coalesce(exception_class, \'\')))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('application_exceptions', function (Blueprint $table): void {
            // Drop PostgreSQL-specific index
            DB::statement('DROP INDEX IF EXISTS application_exceptions_search_idx');

            // Drop the compound indexes
            $table->dropIndex(['application_id', 'status']);
            $table->dropIndex(['application_id', 'level']);
            $table->dropIndex(['application_id', 'environment']);
            $table->dropIndex(['application_id', 'source']);
            $table->dropIndex(['application_id', 'fingerprint']);
            $table->dropIndex(['first_seen_at', 'last_seen_at']);

            // Drop the added columns
            $table->dropColumn([
                'fingerprint',
                'level',
                'status',
                'environment',
                'source',
                'code',
                'occurrence_count',
                'first_seen_at',
                'last_seen_at',
                'resolved_at',
                'request_data',
                'user_data',
                'environment_data',
                'breadcrumbs',
                'previous_exception',
                'metadata',
                'search_vector',
                'tags',
                'notes',
                'resolved_by',
            ]);

            // Rename back to original column name
            $table->renameColumn('exception_class', 'type');
        });
    }
};
