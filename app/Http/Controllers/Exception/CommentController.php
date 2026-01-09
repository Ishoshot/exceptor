<?php

declare(strict_types=1);

namespace App\Http\Controllers\Exception;

use App\Http\Actions\Exception\CreateExceptionCommentAction;
use App\Http\Actions\Exception\DeleteExceptionCommentAction;
use App\Http\Requests\Exception\CreateCommentRequest;
use App\Http\Requests\Exception\DeleteCommentRequest;
use App\Models\ApplicationException;
use App\Models\ExceptionComment;
use Illuminate\Http\RedirectResponse;

final class CommentController
{
    /**
     * Add a comment to an exception.
     */
    public function store(
        CreateCommentRequest $request,
        ApplicationException $exception,
        CreateExceptionCommentAction $action
    ): RedirectResponse {
        $action->handle($request, $exception);

        return back()->with([
            'message' => 'Comment added to exception successfully',
        ]);
    }

    /**
     * Delete a comment from an exception.
     */
    public function destroy(
        DeleteCommentRequest $request,
        ApplicationException $exception,
        ExceptionComment $comment,
        DeleteExceptionCommentAction $action
    ): RedirectResponse {
        $action->handle($request, $exception, $comment);

        return back()->with([
            'message' => 'Comment removed from exception successfully',
        ]);
    }
}
