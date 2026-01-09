import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ExceptionOccurrence, ExceptionOccurrencesProps } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { FaClock, FaNetworkWired, FaServer, FaUser } from 'react-icons/fa';
import SingleOccurrenceView from './single-occurrence-view';

export default function ExceptionOccurrences({ occurrences }: ExceptionOccurrencesProps) {
    const [selectedOccurrence, setSelectedOccurrence] = useState<ExceptionOccurrence | null>(null);

    const selectOccurrence = (occurrence: ExceptionOccurrence) => {
        setSelectedOccurrence(occurrence);
    };

    if (occurrences.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30">
                <p className="text-sm text-gray-500 dark:text-gray-400">No occurrences found for this exception.</p>
            </div>
        );
    }

    // Function to format JSON data for display
    const formatJsonData = (data: Record<string, unknown> | null | undefined) => {
        if (!data) return '{}';
        return JSON.stringify(data, null, 2);
    };

    // Safe string conversion helper
    const safeString = (value: unknown): string => {
        if (value === null || value === undefined) return '';
        return String(value);
    };

    // Function to get a color based on occurrence index (for timeline)
    const getTimelineColor = (index: number) => {
        const colors = [
            'bg-blue-500 dark:bg-blue-600',
            'bg-green-500 dark:bg-green-600',
            'bg-purple-500 dark:bg-purple-600',
            'bg-amber-500 dark:bg-amber-600',
            'bg-rose-500 dark:bg-rose-600',
        ];
        return colors[index % colors.length];
    };

    // Type guard for checking if a property exists in an object
    const hasProperty = <T extends Record<string, unknown>, K extends string>(obj: T | null | undefined, prop: K): obj is T & Record<K, unknown> => {
        return !!obj && prop in obj;
    };

    // Function to safely cast unknown to Record<string, unknown>
    const safeRecord = (value: unknown): Record<string, unknown> | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && value !== null) {
            return value as Record<string, unknown>;
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {selectedOccurrence ? (
                <SingleOccurrenceView
                    occurrence={selectedOccurrence}
                    onBack={() => setSelectedOccurrence(null)}
                    formatJsonData={formatJsonData}
                    safeString={safeString}
                    safeRecord={safeRecord}
                    hasProperty={hasProperty}
                />
            ) : (
                <>
                    {/* Timeline visualization */}
                    <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Occurrence Timeline</h3>
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                            {/* Timeline events */}
                            <div className="space-y-8">
                                {occurrences.map((occurrence, index) => (
                                    <div key={occurrence.id} className="relative pl-12">
                                        {/* Timeline dot */}
                                        <div
                                            className={cn(
                                                'absolute top-1.5 left-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white dark:border-gray-900',
                                                getTimelineColor(index),
                                            )}
                                        ></div>

                                        {/* Timeline content */}
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center gap-2">
                                                <FaClock className="h-3.5 w-3.5 text-gray-400" />
                                                <time className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {format(new Date(occurrence.created_at), 'PPP p')}
                                                </time>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    ({formatDistanceToNow(new Date(occurrence.created_at), { addSuffix: true })})
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    ID: {occurrence.id.substring(0, 8)}
                                                </Badge>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 px-2 text-xs"
                                                    onClick={() => selectOccurrence(occurrence)}
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Occurrence cards */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Occurrences</h3>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {occurrences.length} occurrence{occurrences.length !== 1 ? 's' : ''} found
                            </div>
                        </div>

                        {occurrences.map((occurrence, index) => (
                            <Card
                                key={occurrence.id}
                                id={`occurrence-${occurrence.id}`}
                                className="overflow-hidden border border-gray-200 transition-all hover:shadow-md dark:border-gray-800"
                            >
                                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
                                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                        <div className="flex items-center gap-2">
                                            <div className={cn('h-3 w-3 rounded-full', getTimelineColor(index))}></div>
                                            <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                                Occurrence #{occurrences.length - index}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <FaClock className="h-3.5 w-3.5 text-gray-400" />
                                                <time className="text-sm text-gray-700 dark:text-gray-300">
                                                    {format(new Date(occurrence.created_at), 'PPP p')}
                                                </time>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                ID: {occurrence.id.substring(0, 8)}
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-2 text-xs"
                                                onClick={() => selectOccurrence(occurrence)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        {/* Request summary */}
                                        {occurrence.request_data && hasProperty(occurrence.request_data, 'url') && (
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FaNetworkWired className="h-4 w-4 flex-shrink-0 text-blue-500" />
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">URL</div>
                                                    <div className="truncate font-mono text-sm text-gray-900 dark:text-gray-100">
                                                        {safeString(occurrence.request_data.url)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* User summary */}
                                        {occurrence.user_data && hasProperty(occurrence.user_data, 'email') && (
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FaUser className="h-4 w-4 flex-shrink-0 text-green-500" />
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">User</div>
                                                    <div className="truncate font-mono text-sm text-gray-900 dark:text-gray-100">
                                                        {safeString(occurrence.user_data.email)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Environment summary */}
                                        {occurrence.environment_data && hasProperty(occurrence.environment_data, 'PHP_VERSION') && (
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FaServer className="h-4 w-4 flex-shrink-0 text-amber-500" />
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">PHP</div>
                                                    <div className="truncate font-mono text-sm text-gray-900 dark:text-gray-100">
                                                        {safeString(occurrence.environment_data.PHP_VERSION)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
