<?php

declare(strict_types=1);

namespace App\Http\Controllers\Application\Webhook;

use App\Http\Actions\Application\Webhook\GenerateWebhookUrlAction;
use App\Models\Application;
use Illuminate\Http\RedirectResponse;

final class WebhookGenerationController
{
    /**
     * Generate a webhook URL for the application.
     */
    public function __invoke(Application $application, GenerateWebhookUrlAction $generateWebhookUrlAction): RedirectResponse
    {

        $generateWebhookUrlAction->handle($application);

        // Refresh the application from the database to get the updated data
        $application->refresh();

        return back()->with([
            'success' => 'Webhook URL generated successfully.',
        ])->with('application', $application);
    }
}
