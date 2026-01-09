<?php

declare(strict_types=1);

namespace App\Http\Actions\Api\Webhook;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

final class ValidateWebhookRequestAction
{
    /**
     * Validate the webhook request.
     *
     * @throws ValidationException
     */
    public function handle(Request $request, string $applicationId, string $hash): Application
    {
        // Find the application
        $application = Application::query()->find($applicationId);

        if (! $application) {
            throw ValidationException::withMessages([
                'application' => ['Application not found.'],
            ]);
        }

        // Verify the hash
        if (! $this->verifyHash($application, $hash)) {
            throw ValidationException::withMessages([
                'hash' => ['Invalid webhook hash.'],
            ]);
        }

        // Check rate limiting
        if (! $this->checkRateLimit($application)) {
            throw ValidationException::withMessages([
                'rate_limit' => ['Rate limit exceeded.'],
            ]);
        }

        // Validate the request payload
        $this->validatePayload($request);

        return $application;
    }

    /**
     * Verify the webhook hash.
     */
    private function verifyHash(Application $application, string $hash): bool
    {
        // If no webhook URL is set, reject the request
        if (empty($application->webhook_url)) {
            return false;
        }

        // Extract the hash from the webhook URL
        $urlParts = explode('/', $application->webhook_url);
        $expectedHash = end($urlParts);
        // Compare the hashes
        if (Hash::check($expectedHash, $hash)) {
            return true;
        }

        return $hash === $expectedHash;
    }

    /**
     * Check if the application has exceeded its rate limit.
     */
    private function checkRateLimit(Application $application): bool
    {
        $cacheKey = "webhook_rate_limit:{$application->id}";
        $currentCount = (int) Cache::get($cacheKey, 0);
        $rateLimit = $application->rate_limit ?? 60; // Default to 60 requests per minute

        // If rate limit is exceeded, return false
        if ($currentCount >= $rateLimit) {
            return false;
        }

        // Increment the counter
        Cache::increment($cacheKey);

        // Set the expiry if it's the first request
        if ($currentCount === 0) {
            Cache::put($cacheKey, 1, 60); // Expire after 1 minute
        }

        return true;
    }

    /**
     * Validate the webhook payload.
     *
     * @throws ValidationException
     */
    private function validatePayload(Request $request): void
    {
        $request->validate([
            'exception_class' => 'required|string',
            'message' => 'required|string',
            'file' => 'required|string',
            'line' => 'required|integer',
            'fingerprint' => 'required|string',
            'level' => 'required|string',
            'timestamp' => 'required|string',
        ]);
    }
}
