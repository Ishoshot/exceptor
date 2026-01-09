<?php

declare(strict_types=1);

namespace App\Http\Controllers\Exception;

use App\Http\Actions\Exception\SearchExceptionsAction;
use App\Http\Requests\Exception\SearchExceptionsRequest;
use Inertia\Inertia;
use Inertia\Response;

final class SearchController
{
    /**
     * Display the exceptions search page.
     */
    public function index(
        SearchExceptionsRequest $request,
        SearchExceptionsAction $action
    ): Response {
        $exceptions = $action->handle($request);

        return Inertia::render('exceptions/index', [
            'exceptions' => $exceptions,
            'filters' => $request->validated(),
        ]);
    }
}
