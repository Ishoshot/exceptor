<?php

declare(strict_types=1);

namespace App\Http\Actions\Exception;

use App\Http\Requests\Exception\RemoveTagRequest;
use App\Models\ApplicationException;

final class RemoveExceptionTagAction
{
    /**
     * Remove a tag from an exception.
     */
    public function handle(RemoveTagRequest $request, ApplicationException $exception): ApplicationException
    {
        $data = $request->validated();

        // Detach the tag from the exception
        $exception->tags()->detach($data['tag_id']);

        return $exception->refresh();
    }
}
