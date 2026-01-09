<?php

declare(strict_types=1);

namespace App\Http\Controllers\Exception;

use App\Models\ApplicationException;
use App\Models\ExceptionOccurrence;
use App\Services\CodeSnippetService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final readonly class ExceptionOccurrenceController
{
    public function __construct(
        private CodeSnippetService $codeSnippetService,
    ) {}

    /**
     * Display the specified exception occurrence.
     */
    public function show(
        Request $request, 
        ApplicationException $exception, 
        ExceptionOccurrence $occurrence
    ): Response {
        // Ensure this occurrence belongs to this exception
        if ($occurrence->application_exception_id !== $exception->id) {
            abort(404);
        }

        // Load related exception data
        $exception->load(['application', 'tags']);
        
        // If the exception has trace information, we can use the trace formatter from ExceptionController
        // For now, we'll use a simple property access approach and implement full trace formatting later if needed

        return Inertia::render('exceptions/occurrences/show', [
            'exception' => $exception,
            'occurrence' => $occurrence,
        ]);
    }
}
