<?php

declare(strict_types=1);

namespace App\Http\Actions\Api\Webhook;

use App\Enums\ExceptionEnvironment;
use App\Enums\ExceptionLevel;
use App\Enums\ExceptionSource;
use App\Enums\ExceptionStatus;
use App\Http\Requests\Api\Webhook\HandleWebhookRequest;
use App\Models\Application;
use App\Models\ApplicationException;
use Carbon\Carbon;

final class FindOrCreateExceptionAction
{
    /**
     * Find or create an exception record.
     */
    public function handle(HandleWebhookRequest $request, Application $application): ApplicationException
    {
        // Extract data from the request
        $data = $request->validated();
        $fingerprint = $data['fingerprint'];
        $timestamp = Carbon::parse($data['timestamp']);

        // Try to find an existing exception with the same fingerprint
        $exception = ApplicationException::query()
            ->where('application_id', $application->id)
            ->where('fingerprint', $fingerprint)
            ->first();

        if ($exception) {
            // Update the existing exception
            $exception->update([
                'occurrence_count' => $exception->occurrence_count + 1,
                'last_seen_at' => $timestamp,
            ]);

            return $exception;
        }

        // Create a new exception record
        return ApplicationException::create([
            'application_id' => $application->id,
            'exception_class' => $data['exception_class'],
            'message' => $data['message'],
            'file' => $data['file'],
            'line' => $data['line'],
            'fingerprint' => $fingerprint,
            'level' => ExceptionLevel::tryFrom($data['level']) ?? ExceptionLevel::Error,
            'status' => ExceptionStatus::Unresolved,
            'environment' => $this->determineEnvironment($data),
            'source' => $this->determineSource($data),
            'code' => $data['code'] ?? 0,
            'occurrence_count' => 1,
            'first_seen_at' => $timestamp,
            'last_seen_at' => $timestamp,
            'trace' => $data['trace'] ?? null,
            'trace_formatted' => $data['trace_formatted'] ?? null,
            'request_data' => $data['request'] ?? null,
            'user_data' => $data['user'] ?? null,
            'environment_data' => $data['environment'] ?? null,
            'breadcrumbs' => $data['breadcrumbs'] ?? null,
            'previous_exception' => $data['previous_exception'] ?? null,
            'metadata' => $this->generateMetadata($data),
        ]);
    }

    /**
     * Determine the environment from the exception data.
     */
    private function determineEnvironment(array $data): ExceptionEnvironment
    {
        // If environment data is provided, use it
        if (isset($data['environment']['app_env'])) {
            return ExceptionEnvironment::fromString($data['environment']['app_env']);
        }

        // Default to production
        return ExceptionEnvironment::Production;
    }

    /**
     * Determine the source from the exception data.
     */
    private function determineSource(array $data): ExceptionSource
    {
        return ExceptionSource::determineFromException(
            $data['exception_class'],
            $data['file']
        );
    }

    /**
     * Generate metadata for the exception.
     *
     * @return array<string, mixed>
     */
    private function generateMetadata(array $data): array
    {
        $metadata = [
            'received_at' => now()->toIso8601String(),
        ];

        // Add key request information if available
        if (isset($data['request'])) {
            if (isset($data['request']['url'])) {
                $metadata['url'] = $data['request']['url'];
            }
            if (isset($data['request']['method'])) {
                $metadata['method'] = $data['request']['method'];
            }
            if (isset($data['request']['ip'])) {
                $metadata['ip'] = $data['request']['ip'];
            }
        }

        // Add key user information if available
        if (isset($data['user']) && isset($data['user']['id'])) {
            $metadata['user_id'] = $data['user']['id'];
        }

        // Add key environment info if available
        if (isset($data['environment'])) {
            if (isset($data['environment']['name'])) {
                $metadata['environment'] = $data['environment']['name'];
            }
            if (isset($data['environment']['php'])) {
                $metadata['php_version'] = $data['environment']['php'];
            }
            if (isset($data['environment']['laravel'])) {
                $metadata['laravel_version'] = $data['environment']['laravel'];
            }
        }

        return $metadata;
    }
}
