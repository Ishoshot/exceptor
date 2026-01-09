<?php

declare(strict_types=1);

namespace App\Http\Controllers\Exception;

use App\Http\Actions\Exception\AddExceptionTagAction;
use App\Http\Actions\Exception\RemoveExceptionTagAction;
use App\Http\Requests\Exception\AddTagRequest;
use App\Http\Requests\Exception\RemoveTagRequest;
use App\Models\ApplicationException;
use Illuminate\Http\RedirectResponse;

final class TagController
{
    /**
     * Add a tag to an exception.
     */
    public function add(
        AddTagRequest $request,
        ApplicationException $exception,
        AddExceptionTagAction $action
    ): RedirectResponse {
        $action->handle($request, $exception);

        return back()->with([
            'message' => 'Tag added to exception successfully',
        ]);
    }

    /**
     * Remove a tag from an exception.
     */
    public function remove(
        RemoveTagRequest $request,
        ApplicationException $exception,
        RemoveExceptionTagAction $action
    ): RedirectResponse {
        $action->handle($request, $exception);

        return back()->with([
            'message' => 'Tag removed from exception successfully',
        ]);
    }
}
