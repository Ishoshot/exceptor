<?php

declare(strict_types=1);

namespace App\Http\Actions\Application\Webhook;

use App\Models\Application;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;

final class GenerateWebhookUrlAction
{
    /**
     * Generate a new webhook URL for the application.
     */
    public function handle(Application $application): string
    {
        // Generate a random hash for the webhook URL
        $randomHash = Str::random(32);

        // Get the base URL from environment configuration
        $baseUrl = Config::get('app.url', 'http://localhost');

        // Create the webhook URL with application ID and random hash
        $webhookUrl = sprintf('%s/api/webhook/%s/%s', $baseUrl, $application->id, $randomHash);

        // Update the application with the new webhook URL
        $application->update(['webhook_url' => $webhookUrl]);

        return $webhookUrl;
    }
}
