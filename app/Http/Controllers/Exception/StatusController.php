<?php

declare(strict_types=1);

namespace App\Http\Controllers\Exception;

use App\Http\Actions\Exception\UpdateExceptionStatusAction;
use App\Http\Requests\Exception\UpdateStatusRequest;
use App\Models\ApplicationException;
use Illuminate\Http\RedirectResponse;

final class StatusController
{
    /**
     * Update the status of an exception.
     */
    public function update(
        UpdateStatusRequest $request,
        ApplicationException $exception,
        UpdateExceptionStatusAction $action
    ): RedirectResponse {
        $action->handle($request, $exception);

        return back()->with([
            'message' => 'Exception status updated successfully',
        ]);
    }
}
