<?php

declare(strict_types=1);

namespace App\Http\Controllers\Exception;

use App\Models\ApplicationException;
use App\Services\CodeSnippetService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

final readonly class ExceptionController
{
    public function __construct(
        private CodeSnippetService $codeSnippetService,
    ) {}

    /**
     * Display a listing of the exceptions.
     */
    public function index(): Response
    {
        return Inertia::render('exceptions/index', [
            'exceptions' => ApplicationException::query()
                ->with(['application', 'tags'])
                ->withCount(['comments', 'occurrences'])
                ->latest('last_seen_at')
                ->paginate(12),
        ]);
    }

    /**
     * Display the specified exception.
     */
    public function show(Request $request, ApplicationException $exception): Response
    {
        $exception->load([
            'application',
            'tags',
            'comments',
        ]);

        // Load occurrences with pagination
        $occurrences = $exception->occurrences()->latest('occurred_at')->paginate(10);

        // If trace_formatted is not available, parse the trace string
        if (! $exception->trace_formatted || $exception->trace_formatted->isEmpty()) {
            $traceFormatted = $this->parseTraceString($exception);
            // Add the formatted trace to the exception
            $exception->trace_formatted = collect($traceFormatted);
        }

        // Enhance each frame with code snippets
        $exception->trace_formatted = $this->enhanceTraceWithCodeSnippets($exception->trace_formatted);

        return Inertia::render('exceptions/show', [
            'exception' => $exception,
            'occurrences' => $occurrences,
        ]);
    }

    /**
     * Parse a raw stack trace string into a structured array.
     *
     * @return array<int, array<string, mixed>>
     */
    private function parseTraceString(ApplicationException $exception): array
    {
        $traceFormatted = [];
        if ($exception->trace) {
            $traceLines = explode("\n", $exception->trace);
            foreach ($traceLines as $line) {
                // Skip empty lines
                if (in_array(trim($line), ['', '0'], true)) {
                    continue;
                }

                // Parse the trace line to extract information
                if (preg_match('/^#(\d+)\s+(.+?)(?:\((\d+)\))?: (.+)$/', $line, $matches)) {
                    $frame = [
                        'index' => (int) $matches[1],
                        'file' => $matches[2],
                        'line' => isset($matches[3]) ? (int) $matches[3] : 0,
                        'function' => $matches[4],
                    ];

                    // Extract class and method if available
                    if (preg_match('/([^:]+)(?:::|->)([^(]+)/', $frame['function'], $methodMatches)) {
                        $frame['class'] = $methodMatches[1];
                        $frame['function'] = $methodMatches[2];
                        $frame['type'] = mb_strpos($methodMatches[0], '::') !== false ? '::' : '->';
                    }

                    $traceFormatted[] = $frame;
                }
            }
        }

        // If no trace is available, create a default frame with the exception information
        if ($traceFormatted === []) {
            $traceFormatted[] = [
                'index' => 0,
                'file' => $exception->file,
                'line' => $exception->line,
                'function' => 'unknown',
                'class' => $exception->exception_class,
            ];
        }

        return $traceFormatted;
    }

    /**
     * Enhance trace frames with code snippets.
     *
     * @param  Collection<int, array<string, mixed>>  $traceFormatted
     * @return Collection<int, array<string, mixed>>
     */
    private function enhanceTraceWithCodeSnippets(Collection $traceFormatted): Collection
    {
        return $traceFormatted->map(function ($frame): array {
            if (isset($frame['file'], $frame['line']) && file_exists($frame['file'])) {
                $codeContext = $this->codeSnippetService->getSnippetForFrame($frame);
                $frame['code_snippet'] = $codeContext['snippet'];
                $frame['code_start_line'] = $codeContext['start_line'];
                $frame['code_end_line'] = $codeContext['end_line'];
                $frame['code_highlight_line'] = $codeContext['highlight_line'];
            }

            return $frame;
        });
    }
}
