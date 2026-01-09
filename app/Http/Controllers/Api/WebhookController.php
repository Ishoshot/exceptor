<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Actions\Api\Webhook\ProcessWebhookDataAction;
use App\Http\Requests\Api\Webhook\HandleWebhookRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

final class WebhookController
{
    /**
     * Handle incoming webhook data from Laravel applications.
     */
    public function handle(
        HandleWebhookRequest $request,
        ProcessWebhookDataAction $processWebhookDataAction
    ): JsonResponse {
        try {
            // Log the incoming webhook request
            Log::info('Webhook received', [
                'request' => $request->all(),
                'application_id' => $request->route('applicationId'),
                'hash' => $request->route('hash'),
            ]);

            // Process the webhook data
            $result = $processWebhookDataAction->handle($request);

            // Return a successful response
            return response()->json([
                'message' => 'Exception data received successfully',
                'data' => [
                    'exception_id' => $result['exception']->id,
                    'occurrence_id' => $result['occurrence']->id,
                ],
            ], JsonResponse::HTTP_CREATED);
        } catch (Throwable $e) {
            // Log the error
            Log::error('Error processing webhook', [
                'error' => $e->getMessage(),
                'application_id' => $request->route('applicationId'),
                'hash' => $request->route('hash'),
            ]);

            // Return a generic error response
            return response()->json([
                'message' => 'Failed to process exception data',
                'data' => null,
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
