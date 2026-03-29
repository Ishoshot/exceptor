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
        $statusValue = (string) $request->input('status', ExceptionStatus::Resolved->value);
        $status = ExceptionStatus::tryFrom($statusValue) ?? ExceptionStatus::Unresolved;
        $userId = $request->input('user_id', $request->user()?->id);

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
        if ($request->filled('notes') && $userId) {
            ExceptionComment::create([
                'application_exception_id' => $exception->id,
                'user_id' => $userId,
                'content' => (string) $request->input('notes'),
                'metadata' => $request->all(),
                'is_internal' => true,
            ]);
        }

        return $exception->refresh();
    }
}
