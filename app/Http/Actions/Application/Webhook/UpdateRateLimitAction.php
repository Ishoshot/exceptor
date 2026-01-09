<?php

declare(strict_types=1);

namespace App\Http\Actions\Application\Webhook;

use App\Models\Application;

final class UpdateRateLimitAction
{
    /**
     * Update the rate limit for the application's webhook.
     */
    public function handle(Application $application, int $rateLimit): void
    {
        $application->update(['rate_limit' => $rateLimit]);
    }
}
