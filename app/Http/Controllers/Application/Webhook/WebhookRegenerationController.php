<?php

declare(strict_types=1);

namespace App\Http\Controllers\Application\Webhook;

use App\Http\Actions\Application\Webhook\GenerateWebhookUrlAction;
use App\Models\Application;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

final class WebhookRegenerationController
{
    /**
     * Regenerate the webhook URL for the application.
     */
    public function __invoke(Request $request, Application $application, GenerateWebhookUrlAction $generateWebhookUrlAction): RedirectResponse
    {

        $generateWebhookUrlAction->handle($application);

        // Refresh the application from the database to get the updated data
        $application->refresh();

        return back()->with([
            'success' => 'Webhook URL regenerated successfully.',
        ])->with('application', $application);
    }
}
