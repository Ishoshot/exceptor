import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ExceptionStackTraceProps, StackFrame } from '@/types';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCode, FaExternalLinkAlt, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

export default function ExceptionStackTrace({ exception }: ExceptionStackTraceProps) {
    const [showFullPaths, setShowFullPaths] = useState(false);
    const [expandedFrames, setExpandedFrames] = useState<number[]>([0]); // First frame expanded by default
    const [displayMode, setDisplayMode] = useState<'relevant' | 'full' | 'raw'>('relevant');
    const [sortDirection, setSortDirection] = useState<'top-down' | 'bottom-up'>('top-down');

    // Parse stack trace from exception
    const parseStackTrace = (): StackFrame[] => {
        if (!exception.trace_formatted || !Array.isArray(exception.trace_formatted)) {
            // Fallback to a simple stack frame if trace_formatted is not available
            return [
                {
                    index: 0,
                    file: exception.file,
                    line: exception.line,
                    function: 'unknown',
                    class: exception.exception_class,
                },
            ];
        }

        return exception.trace_formatted.map((frame: any, index: number) => ({
            index,
            file: frame.file || 'unknown',
            line: frame.line || 0,
            function: frame.function || 'unknown',
            class: frame.class || undefined,
            type: frame.type || undefined,
            args: frame.args || [],
            code_snippet: frame.code_snippet || {},
            code_start_line: frame.code_start_line,
            code_end_line: frame.code_end_line,
            code_highlight_line: frame.code_highlight_line,
        }));
    };

    // Toggle frame expansion
    const toggleFrameExpansion = (index: number) => {
        setExpandedFrames((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    // Check if a frame is expanded
    const isFrameExpanded = (index: number) => expandedFrames.includes(index);

    // Format file path for display
    const formatFilePath = (path: string) => {
        if (showFullPaths) return path;

        const parts = path.split('/');
        if (parts.length <= 3) return path;

        return '.../' + parts.slice(-3).join('/');
    };

    // Get stack frames based on current settings
    const getStackFrames = () => {
        let frames = parseStackTrace();

        // Apply sorting
        if (sortDirection === 'bottom-up') {
            frames = [...frames].reverse();
        }

        // Apply display mode filtering
        if (displayMode === 'relevant') {
            // Filter out vendor frames (simplified example)
            frames = frames.filter((frame) => !frame.file.includes('/vendor/') || isFrameExpanded(frame.index));
        }

        return frames;
    };

    // Toggle sort direction
    const toggleSortDirection = () => {
        setSortDirection((prev) => (prev === 'top-down' ? 'bottom-up' : 'top-down'));
    };

    // Toggle display mode
    const toggleDisplayMode = () => {
        setDisplayMode((prev) => {
            if (prev === 'relevant') return 'full';
            if (prev === 'full') return 'raw';
            return 'relevant';
        });
    };

    // Toggle show full paths
    const toggleShowFullPaths = () => {
        setShowFullPaths((prev) => !prev);
    };

    const frames = getStackFrames();

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" onClick={toggleSortDirection} className="h-8 gap-1.5 text-xs">
                        {sortDirection === 'top-down' ? (
                            <>
                                <FaSortAmountDown className="h-3 w-3" />
                                <span>Top-Down</span>
                            </>
                        ) : (
                            <>
                                <FaSortAmountUp className="h-3 w-3" />
                                <span>Bottom-Up</span>
                            </>
                        )}
                    </Button>

                    <Button variant="outline" size="sm" onClick={toggleDisplayMode} className="h-8 text-xs">
                        {displayMode === 'relevant' ? 'Show All Frames' : displayMode === 'full' ? 'Show Raw Trace' : 'Show Relevant'}
                    </Button>

                    <Button variant="outline" size="sm" onClick={toggleShowFullPaths} className="h-8 text-xs">
                        {showFullPaths ? 'Hide Full Paths' : 'Show Full Paths'}
                    </Button>
                </div>

                <div className="text-xs text-gray-500">{frames.length} frames</div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                {displayMode === 'raw' ? (
                    <div className="overflow-auto p-4">
                        <pre className="font-mono text-xs whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                            {exception.trace || 'No raw stack trace available'}
                        </pre>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {frames.map((frame, frameIndex) => (
                            <div
                                key={frameIndex}
                                className={cn(
                                    'transition-colors',
                                    frameIndex === 0 ? 'bg-red-50 dark:bg-red-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex cursor-pointer items-start justify-between px-4 py-3',
                                        isFrameExpanded(frame.index) && 'border-b border-gray-200 dark:border-gray-800',
                                    )}
                                    onClick={() => toggleFrameExpansion(frame.index)}
                                >
                                    <div className="flex items-start space-x-2">
                                        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                                            {isFrameExpanded(frame.index) ? (
                                                <FaChevronDown className="h-3 w-3 text-gray-500" />
                                            ) : (
                                                <FaChevronUp className="h-3 w-3 rotate-180 text-gray-500" />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {frame.class && frame.function ? (
                                                        <>
                                                            <span className="text-gray-500">{frame.class}</span>
                                                            <span className="text-gray-500">{frame.type}</span>
                                                            <span>{frame.function}()</span>
                                                        </>
                                                    ) : frame.function ? (
                                                        <span>{frame.function}()</span>
                                                    ) : (
                                                        <span className="text-gray-500 italic">Unknown function</span>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="mt-1 flex items-center text-xs text-gray-500">
                                                <span className="font-mono">{formatFilePath(frame.file)}</span>
                                                <span className="mx-1">:</span>
                                                <span className="font-mono">{frame.line}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                        {frame.code_snippet && Object.keys(frame.code_snippet).length > 0 && (
                                            <TooltipProvider>
                                                <Tooltip content="Has code snippet">
                                                    <TooltipTrigger asChild>
                                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800">
                                                            <FaCode className="h-3 w-3" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        <p className="text-xs">Has code snippet</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}

                                        {frame.file && frame.file.startsWith('/') && (
                                            <TooltipProvider>
                                                <Tooltip content="Open in editor">
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // This would open the file in an editor or similar
                                                                console.log(`Open file: ${frame.file}:${frame.line}`);
                                                            }}
                                                        >
                                                            <FaExternalLinkAlt className="h-2.5 w-2.5" />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">
                                                        <p className="text-xs">Open in editor</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </div>

                                {isFrameExpanded(frame.index) && (
                                    <div className="bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
                                        {frame.code_snippet && Object.keys(frame.code_snippet).length > 0 ? (
                                            <div className="overflow-hidden rounded border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full font-mono text-xs">
                                                        <tbody>
                                                            {Object.entries(frame.code_snippet).map(([lineNumber, code]) => {
                                                                const line = parseInt(lineNumber);
                                                                const isHighlighted = line === frame.code_highlight_line || line === frame.line;

                                                                return (
                                                                    <tr
                                                                        key={line}
                                                                        className={cn(isHighlighted && 'bg-yellow-50 dark:bg-yellow-900/20')}
                                                                    >
                                                                        <td className="border-r border-gray-200 px-2 py-1 text-right whitespace-nowrap text-gray-500 select-none dark:border-gray-700">
                                                                            {line}
                                                                        </td>
                                                                        <td className="px-4 py-1 whitespace-pre text-gray-800 dark:text-gray-200">
                                                                            {code}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-gray-500">No code snippet available</div>
                                        )}

                                        {frame.args && frame.args.length > 0 && (
                                            <div className="mt-3">
                                                <h4 className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">Arguments</h4>
                                                <div className="rounded border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
                                                    <pre className="font-mono text-xs whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                                                        {JSON.stringify(frame.args, null, 2)}
                                                    </pre>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
