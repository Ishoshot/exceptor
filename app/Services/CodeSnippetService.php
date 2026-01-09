<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\File;

final class CodeSnippetService
{
    /**
     * Number of lines to show before and after the target line.
     */
    private int $contextLines = 5;

    /**
     * Get code snippet for a file and line.
     *
     * @return array<int, string>|null Array of lines with line numbers as keys, or null if file not found
     */
    public function getCodeSnippet(string $filePath, int $lineNumber): ?array
    {
        // Check if file exists and is readable
        if (! File::exists($filePath) || ! is_readable($filePath)) {
            return null;
        }

        // Read the file content
        $content = File::get($filePath);
        $lines = explode("\n", $content);

        // Calculate the range of lines to show
        $start = max(0, $lineNumber - $this->contextLines - 1);
        $end = min(count($lines) - 1, $lineNumber + $this->contextLines - 1);

        // Extract the relevant lines
        $result = [];
        for ($i = $start; $i <= $end; $i++) {
            $result[$i + 1] = $lines[$i] ?? '';
        }

        return $result;
    }

    /**
     * Get code snippet for a stack trace frame.
     *
     * @param  array<string, mixed>  $frame
     * @return array{snippet: array<int, string>|null, start_line: int, end_line: int, highlight_line: int}
     */
    public function getSnippetForFrame(array $frame): array
    {
        $file = $frame['file'] ?? null;
        $line = $frame['line'] ?? 0;

        if (! $file || ! $line) {
            return [
                'snippet' => null,
                'start_line' => 0,
                'end_line' => 0,
                'highlight_line' => 0,
            ];
        }

        $snippet = $this->getCodeSnippet($file, $line);

        return [
            'snippet' => $snippet,
            'start_line' => $snippet !== null && $snippet !== [] ? min(array_keys($snippet)) : 0,
            'end_line' => $snippet !== null && $snippet !== [] ? max(array_keys($snippet)) : 0,
            'highlight_line' => $line,
        ];
    }

    /**
     * Set the number of context lines.
     */
    public function setContextLines(int $lines): self
    {
        $this->contextLines = $lines;

        return $this;
    }
}
