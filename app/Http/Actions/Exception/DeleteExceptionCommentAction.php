<?php

declare(strict_types=1);

namespace App\Http\Actions\Exception;

use App\Http\Requests\Exception\DeleteCommentRequest;
use App\Models\ApplicationException;
use App\Models\ExceptionComment;

final class DeleteExceptionCommentAction
{
    /**
     * Delete a comment from an exception.
     */
    public function handle(
        DeleteCommentRequest $request,
        ApplicationException $exception,
        ExceptionComment $comment
    ): bool {
        // Verify the comment belongs to the exception
        if ($comment->application_exception_id !== $exception->id) {
            return false;
        }

        return $comment->delete();
    }
}
