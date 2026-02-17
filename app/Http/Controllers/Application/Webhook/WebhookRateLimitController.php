<?php

declare(strict_types=1);

namespace App\Http\Controllers\Application\Webhook;

use App\Http\Actions\Application\Webhook\UpdateRateLimitAction;
use App\Models\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class WebhookRateLimitController
{
    /**
     * Update the rate limit for the application's webhook.
     */
    public function __invoke(Request $request, Application $application, UpdateRateLimitAction $updateRateLimitAction): RedirectResponse
    {

        $request->validate([
            'rate_limit' => 'nullable|integer|min:0|max:500000',
        ]);

        $updateRateLimitAction->handle($application, (int) $request->input('rate_limit', 0));

        // Refresh the application from the database to get the updated data
        $application->refresh();

        return back()->with([
            'success' => 'Rate limit updated successfully.',
        ])->with('application', $application);
    }
}
