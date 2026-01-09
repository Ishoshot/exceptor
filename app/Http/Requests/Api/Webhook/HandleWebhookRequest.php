<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\Webhook;

use App\Models\Application;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

final class HandleWebhookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $applicationId = $this->route('applicationId');
        $hash = $this->route('hash');

        // Find the application
        $application = Application::query()->where('id', $applicationId)->first();

        if (! $application) {
            return false;
        }

        // Verify the hash
        if (! $this->verifyHash($application, $hash)) {
            return false;
        }

        // Check rate limiting
        if (! $this->checkRateLimit($application)) {
            throw ValidationException::withMessages([
                'rate_limit' => ['Rate limit exceeded.'],
            ]);
        }

        // Store the application in the request for later use
        $this->merge(['application' => $application]);

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'exception_class' => 'required|string',
            'message' => 'required|string',
            'file' => 'required|string',
            'line' => 'required|integer',
            'code' => 'nullable|integer',
            'trace' => 'nullable|string',
            'trace_formatted' => 'nullable|array',
            'fingerprint' => 'required|string',
            'level' => 'required|string',
            'timestamp' => 'required|string|date_format:Y-m-d H:i:s',
            'status' => 'nullable|string',
            'first_seen_at' => 'nullable|string|date_format:Y-m-d H:i:s',
            'last_seen_at' => 'nullable|string|date_format:Y-m-d H:i:s',
            'occurrence_count' => 'nullable|integer',
            'request' => 'nullable|array',
            'user' => 'nullable|array',
            'environment' => 'nullable|array',
            'breadcrumbs' => 'nullable|array',
            'previous_exception' => 'nullable|array',
        ];
    }

    /**
     * Get the application from the request.
     */
    public function getApplication(): Application
    {
        return $this->application;
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
        return $hash === $expectedHash;
    }

    /**
     * Check if the application has exceeded its rate limit.
     */
    private function checkRateLimit(Application $application): bool
    {
        $key = "webhook:{$application->id}";

        $rateLimit = $application->rate_limit ?? 60; // Default to 60 requests per minute

        // Check if the rate limit has been exceeded
        if (RateLimiter::tooManyAttempts($key, $rateLimit)) {
            return false;
        }

        // Increment the rate limiter counter
        RateLimiter::hit($key, 60); // Reset after 60 seconds

        return true;
    }
}
