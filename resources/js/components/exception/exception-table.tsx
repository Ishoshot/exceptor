import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Exception } from '@/types';
import { Link } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import React, { useState } from 'react';
import { FaCalendarAlt, FaChevronDown, FaChevronUp, FaClock, FaExclamationCircle, FaTag } from 'react-icons/fa';
import { HiOutlineStatusOnline } from 'react-icons/hi';

interface ExceptionTableProps {
    exceptions: Exception[];
    onSort?: (column: string) => void;
    sortColumn?: string;
    sortDirection?: 'asc' | 'desc';
}

export default function ExceptionTable({ exceptions, onSort, sortColumn = 'last_seen_at', sortDirection = 'desc' }: ExceptionTableProps) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    // Toggle row expansion
    const toggleRowExpansion = (id: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Helper functions for styling
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'muted':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'ignored':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300';
            case 'unresolved':
            default:
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'debug':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300';
            case 'info':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'notice':
                return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'error':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
            case 'critical':
            case 'alert':
            case 'emergency':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300';
        }
    };

    const getEnvironmentColor = (environment: string) => {
        switch (environment) {
            case 'production':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'staging':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
            case 'development':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'testing':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'local':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300';
        }
    };

    // Format the exception class to be more readable
    const formatExceptionClass = (exceptionClass: string) => {
        const parts = exceptionClass.split('\\');
        return parts[parts.length - 1];
    };

    // Handle column sorting
    const handleSort = (column: string) => {
        if (onSort) {
            onSort(column);
        }
    };

    // Render sort indicator
    const renderSortIndicator = (column: string) => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? <FaChevronUp className="ml-1 h-3 w-3" /> : <FaChevronDown className="ml-1 h-3 w-3" />;
        }
        return null;
    };

    // Render the trend indicator (mock data for now)
    const renderTrend = (exception: Exception) => {
        // This would be based on real data in a production environment
        const trendType = Math.floor(Math.random() * 3); // 0: up, 1: down, 2: stable

        if (trendType === 0) {
            return (
                <div className="flex h-8 items-center">
                    <svg className="h-full w-20" viewBox="0 0 100 25">
                        <polyline points="0,25 20,20 40,22 60,15 80,18 100,5" fill="none" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="2" />
                    </svg>
                </div>
            );
        } else if (trendType === 1) {
            return (
                <div className="flex h-8 items-center">
                    <svg className="h-full w-20" viewBox="0 0 100 25">
                        <polyline points="0,5 20,10 40,8 60,15 80,12 100,20" fill="none" stroke="rgba(34, 197, 94, 0.5)" strokeWidth="2" />
                    </svg>
                </div>
            );
        } else {
            return (
                <div className="flex h-8 items-center">
                    <svg className="h-full w-20" viewBox="0 0 100 25">
                        <polyline points="0,15 20,13 40,16 60,14 80,15 100,13" fill="none" stroke="rgba(156, 163, 175, 0.5)" strokeWidth="2" />
                    </svg>
                </div>
            );
        }
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th
                                scope="col"
                                className="w-12 px-3 py-3.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                            >
                                <span className="sr-only">Expand</span>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                onClick={() => handleSort('exception_class')}
                            >
                                <div className="flex cursor-pointer items-center">
                                    Issue
                                    {renderSortIndicator('exception_class')}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                onClick={() => handleSort('last_seen_at')}
                            >
                                <div className="flex cursor-pointer items-center">
                                    Last Seen
                                    {renderSortIndicator('last_seen_at')}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                onClick={() => handleSort('first_seen_at')}
                            >
                                <div className="flex cursor-pointer items-center">
                                    Age
                                    {renderSortIndicator('first_seen_at')}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                            >
                                Trend
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                                onClick={() => handleSort('occurrence_count')}
                            >
                                <div className="flex cursor-pointer items-center">
                                    Events
                                    {renderSortIndicator('occurrence_count')}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                            >
                                Users
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                            >
                                Priority
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                            >
                                Assignee
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                        {exceptions.map((exception) => (
                            <React.Fragment key={exception.id}>
                                <tr
                                    className={cn(
                                        'group hover:bg-gray-50 dark:hover:bg-gray-800/50',
                                        expandedRows[exception.id] && 'bg-gray-50 dark:bg-gray-800/50',
                                    )}
                                >
                                    <td className="px-3 py-4 text-sm whitespace-nowrap">
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleRowExpansion(exception.id)}>
                                            {expandedRows[exception.id] ? (
                                                <FaChevronDown className="h-3 w-3" />
                                            ) : (
                                                <FaChevronUp className="h-3 w-3 rotate-180" />
                                            )}
                                        </Button>
                                    </td>
                                    <td className="max-w-md px-3 py-4 text-sm whitespace-nowrap">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 pt-0.5">
                                                <FaExclamationCircle
                                                    className={cn(
                                                        'h-4 w-4',
                                                        exception.level === 'error' ||
                                                            exception.level === 'critical' ||
                                                            exception.level === 'alert' ||
                                                            exception.level === 'emergency'
                                                            ? 'text-red-500'
                                                            : exception.level === 'warning'
                                                              ? 'text-yellow-500'
                                                              : 'text-blue-500',
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <Link
                                                    href={route('exceptions.show', { exception: exception.id })}
                                                    className="font-medium text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                                                >
                                                    {formatExceptionClass(exception.exception_class)}
                                                </Link>
                                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    {exception.message.length > 60 ? `${exception.message.substring(0, 60)}...` : exception.message}
                                                </div>
                                                <div className="mt-1 flex flex-wrap gap-1.5">
                                                    <Badge className={getLevelColor(exception.level)}>{exception.level}</Badge>
                                                    <Badge className={getEnvironmentColor(exception.environment)}>{exception.environment}</Badge>
                                                    {exception.tags.slice(0, 2).map((tag) => (
                                                        <Badge
                                                            key={tag.id}
                                                            className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                            style={{ backgroundColor: tag.color, color: '#fff' }}
                                                        >
                                                            {tag.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                        <Tooltip content={format(new Date(exception.last_seen_at), 'PPP p')}>
                                            <span>{formatDistanceToNow(new Date(exception.last_seen_at), { addSuffix: true })}</span>
                                        </Tooltip>
                                    </td>
                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                        <Tooltip content={format(new Date(exception.first_seen_at), 'PPP p')}>
                                            <span>{formatDistanceToNow(new Date(exception.first_seen_at), { addSuffix: true })}</span>
                                        </Tooltip>
                                    </td>
                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{renderTrend(exception)}</td>
                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                        {exception.occurrence_count}
                                    </td>
                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                        {/* This would be real data in production */}
                                        {Math.floor(Math.random() * 10)}
                                    </td>
                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center">
                                            <div
                                                className={cn(
                                                    'h-2 w-2 rounded-full',
                                                    exception.level === 'critical' || exception.level === 'alert' || exception.level === 'emergency'
                                                        ? 'bg-red-500'
                                                        : exception.level === 'error'
                                                          ? 'bg-orange-500'
                                                          : exception.level === 'warning'
                                                            ? 'bg-yellow-500'
                                                            : 'bg-blue-500',
                                                )}
                                            />
                                            <span className="ml-1.5">
                                                {exception.level === 'critical' || exception.level === 'alert' || exception.level === 'emergency'
                                                    ? 'P0'
                                                    : exception.level === 'error'
                                                      ? 'P1'
                                                      : exception.level === 'warning'
                                                        ? 'P2'
                                                        : 'P3'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                        <Button variant="outline" size="sm" className="h-7 text-xs">
                                            Assign
                                        </Button>
                                    </td>
                                </tr>
                                {expandedRows[exception.id] && (
                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                        <td colSpan={9} className="px-3 py-4">
                                            <div className="rounded border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <div>
                                                        <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Exception Details</h4>
                                                        <div className="rounded-md bg-gray-100 p-3 font-mono text-xs dark:bg-gray-800">
                                                            <div>
                                                                <span className="text-gray-500">File:</span> {exception.file}
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500">Line:</span> {exception.line}
                                                            </div>
                                                            <div className="mt-2">
                                                                <span className="text-gray-500">Message:</span> {exception.message}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Recent Activity</h4>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <FaClock className="mr-1.5 h-3 w-3" />
                                                                <span>
                                                                    Last seen{' '}
                                                                    {formatDistanceToNow(new Date(exception.last_seen_at), { addSuffix: true })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <FaCalendarAlt className="mr-1.5 h-3 w-3" />
                                                                <span>
                                                                    First seen{' '}
                                                                    {formatDistanceToNow(new Date(exception.first_seen_at), { addSuffix: true })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <FaTag className="mr-1.5 h-3 w-3" />
                                                                <span>{exception.occurrence_count} occurrences</span>
                                                            </div>
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <HiOutlineStatusOnline className="mr-1.5 h-3 w-3" />
                                                                <span>
                                                                    Status:{' '}
                                                                    <Badge className={getStatusColor(exception.status)}>{exception.status}</Badge>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex justify-end space-x-2">
                                                    <Button variant="outline" size="sm" className="h-8 text-xs">
                                                        View Details
                                                    </Button>
                                                    <Button size="sm" className="h-8 text-xs">
                                                        Resolve Issue
                                                    </Button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
