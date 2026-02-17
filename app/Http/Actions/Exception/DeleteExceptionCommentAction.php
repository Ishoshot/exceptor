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
        return ExceptionComment::query()
            ->where('id', $comment->id)
            ->forceDelete() > 0;
    }
}
