<?php

declare(strict_types=1);

namespace App\Http\Actions\Api\Webhook;

use App\Http\Requests\Api\Webhook\HandleWebhookRequest;
use App\Models\Application;
use App\Models\ApplicationException;
use App\Models\ExceptionOccurrence;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

final readonly class ProcessWebhookDataAction
{
    public function __construct(
        private FindOrCreateExceptionAction $findOrCreateExceptionAction,
        private StoreExceptionOccurrenceAction $storeExceptionOccurrenceAction,
    ) {}

    /**
     * Process the webhook data.
     *
     * @return array{application: Application, exception: ApplicationException, occurrence: ExceptionOccurrence}
     */
    public function handle(HandleWebhookRequest $request): array
    {
        Log::info('Incoming webhook payload', [
            'application_id' => $request->route('applicationId'),
            'payload' => $request->all(),
            'headers' => $request->headers->all(),
        ]);

        try {
            return DB::transaction(function () use ($request): array {
                // Get the application from the request (already validated)
                $application = $request->getApplication();

                // Find or create the exception
                $exception = $this->findOrCreateExceptionAction->handle($request, $application);

                // Store the exception occurrence
                $occurrence = $this->storeExceptionOccurrenceAction->handle($request, $exception);

                return [
                    'application' => $application,
                    'exception' => $exception,
                    'occurrence' => $occurrence,
                ];
            });
        } catch (Throwable $e) {
            Log::error('Failed to process webhook data', [
                'error' => $e->getMessage(),
                'application_id' => $request->route('applicationId'),
                'hash' => $request->route('hash'),
            ]);

            throw $e;
        }
    }
}
