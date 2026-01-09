<?php

declare(strict_types=1);

namespace App\Http\Actions\Api\Webhook;

use App\Http\Requests\Api\Webhook\HandleWebhookRequest;
use App\Models\ApplicationException;
use App\Models\ExceptionOccurrence;
use Carbon\Carbon;

final class StoreExceptionOccurrenceAction
{
    /**
     * Store a new exception occurrence.
     */
    public function handle(HandleWebhookRequest $request, ApplicationException $exception): ExceptionOccurrence
    {
        $data = $request->validated();
        $timestamp = Carbon::parse($data['timestamp']);

        return ExceptionOccurrence::create([
            'application_exception_id' => $exception->id,
            'request_data' => $data['request'] ?? null,
            'user_data' => $data['user'] ?? null,
            'environment_data' => $data['environment'] ?? null,
            'breadcrumbs' => $data['breadcrumbs'] ?? null,
            'metadata' => $this->generateMetadata($data),
            'occurred_at' => $timestamp,
        ]);
    }

    /**
     * Generate metadata for the exception occurrence.
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
