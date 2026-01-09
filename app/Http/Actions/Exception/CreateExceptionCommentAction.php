<?php

declare(strict_types=1);

namespace App\Http\Actions\Exception;

use App\Http\Requests\Exception\CreateCommentRequest;
use App\Models\ApplicationException;
use App\Models\ExceptionComment;

final class CreateExceptionCommentAction
{
    /**
     * Create a new comment for an exception.
     */
    public function handle(CreateCommentRequest $request, ApplicationException $exception): ExceptionComment
    {
        $data = $request->validated();

        return ExceptionComment::create([
            'application_exception_id' => $exception->id,
            'user_id' => $request->user()?->id,
            'content' => $data['content'],
            'is_internal' => $data['is_internal'] ?? false,
            'metadata' => $data['metadata'] ?? null,
        ]);
    }
}
