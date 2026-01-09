<?php

declare(strict_types=1);

namespace App\Http\Actions\Exception;

use App\Enums\ExceptionStatus;
use App\Http\Requests\Exception\UpdateStatusRequest;
use App\Models\ApplicationException;
use App\Models\ExceptionComment;

final class UpdateExceptionStatusAction
{
    /**
     * Update the status of an exception.
     */
    public function handle(UpdateStatusRequest $request, ApplicationException $exception): ApplicationException
    {
        $data = $request->validated();
        $status = ExceptionStatus::from($data['status']);
        $userId = $request->user()?->id;

        // Update the exception status
        switch ($status) {
            case ExceptionStatus::Resolved:
                $exception->markAsResolved($userId);
                break;

            case ExceptionStatus::Unresolved:
                $exception->markAsUnresolved();
                break;

            case ExceptionStatus::Muted:
                $exception->markAsMuted();
                break;

            case ExceptionStatus::Ignored:
                $exception->update(['status' => ExceptionStatus::Ignored]);
                break;
        }

        // Add a comment if notes are provided
        if (isset($data['notes']) && $data['notes'] && $userId) {
            ExceptionComment::create([
                'application_exception_id' => $exception->id,
                'user_id' => $userId,
                'content' => $data['notes'],
                'metadata' => [
                    'status_change' => [
                        'from' => $exception->getOriginal('status'),
                        'to' => $status->value,
                    ],
                ],
                'is_internal' => true,
            ]);
        }

        return $exception->refresh();
    }
}
