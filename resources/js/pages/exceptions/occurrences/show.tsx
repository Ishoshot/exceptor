import ExceptionBreadcrumbs from '@/components/exception/exception-breadcrumbs';
import ExceptionEnvironmentBadge from '@/components/exception/exception-environment-badge';
import ExceptionLevelBadge from '@/components/exception/exception-level-badge';
import ExceptionMetadata from '@/components/exception/exception-metadata';
import ExceptionStackTrace from '@/components/exception/exception-stack-trace';
import ExceptionStatusBadge from '@/components/exception/exception-status-badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Exception, ExceptionBreadcrumbItem, ExceptionOccurrence } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaServer, FaTag } from 'react-icons/fa';

interface Props {
    exception: Exception;
    occurrence: ExceptionOccurrence;
}

export default function Show({ exception, occurrence }: Props) {
    // Generate navigation breadcrumbs
    const navBreadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Exceptions',
            href: route('exceptions.index'),
        },
        {
            title: exception.message.length > 30 ? `${exception.message.substring(0, 30)}...` : exception.message,
            href: route('exceptions.show', { exception: exception.id }),
        },
        {
            title: `Occurrence ${occurrence.id.substring(0, 8)}`,
            href: route('exceptions.occurrences.show', { exception: exception.id, occurrence: occurrence.id }),
        },
    ];

    // Format exception class to be more readable
    const formatExceptionClass = (exceptionClass: string) => {
        const parts = exceptionClass.split('\\');
        return parts[parts.length - 1];
    };

    // Generate breadcrumbs from occurrence data
    const exceptionBreadcrumbs = useMemo(() => {
        if (occurrence.breadcrumbs && occurrence.breadcrumbs.length > 0) {
            // Convert the breadcrumbs to the expected format
            return occurrence.breadcrumbs.map(crumb => ({
                id: String(Math.random()),
                type: crumb.type || 'info',
                timestamp: crumb.timestamp || new Date().toISOString(),
                data: crumb.data || {},
                level: 'info',
                category: crumb.category || 'general',
                message: crumb.message || ''
            })) as ExceptionBreadcrumbItem[];
        }

        return [] as ExceptionBreadcrumbItem[];
    }, [occurrence.breadcrumbs]);

    // Get status color for background styling
    const getStatusColor = () => {
        switch (exception.status) {
            case 'resolved':
                return 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20';
            case 'muted':
                return 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20';
            case 'ignored':
                return 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20';
            case 'unresolved':
            default:
                return 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20';
        }
    };

    // Safe helper functions for TypeScript
    const hasProperty = <T extends Record<string, unknown>, K extends string>(obj: T | null | undefined, prop: K): obj is T & Record<K, unknown> => {
        return !!obj && prop in obj;
    };

    const getRequestUrl = () => {
        if (occurrence.request_data && hasProperty(occurrence.request_data, 'url')) {
            return String(occurrence.request_data.url);
        }
        return null;
    };

    return (
        <AppLayout breadcrumbs={navBreadcrumbs}>
            <Head title={`Exception Occurrence: ${formatExceptionClass(exception.exception_class)}`} />

            <div className="flex flex-1 flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
                {/* Back to exception button */}
                <div className="flex items-center gap-2">
                    <Link href={route('exceptions.show', { exception: exception.id })} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 gap-1">
                        <FaArrowLeft className="h-3 w-3 mr-1" />
                        Back to Exception
                    </Link>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Viewing occurrence from {formatDistanceToNow(new Date(occurrence.created_at), { addSuffix: true })}
                    </span>
                </div>

                {/* Exception Header */}
                <div className={cn('relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800', getStatusColor())}>
                    <div className="px-6 py-5">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                            <div className="max-w-2xl">
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                        {exception.application.name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {exception.file.split('/').slice(-3).join('/')}:{exception.line}
                                    </span>
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{formatExceptionClass(exception.exception_class)}</h1>
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{exception.message}</p>
                                {getRequestUrl() && (
                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="font-medium">URL:</span> {getRequestUrl()}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-shrink-0 flex-wrap gap-2">
                                <ExceptionStatusBadge status={exception.status} />
                                <ExceptionLevelBadge level={exception.level} />
                                <ExceptionEnvironmentBadge environment={exception.environment} />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                            <div className="flex items-center gap-1.5">
                                <FaClock className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">Occurred:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatDistanceToNow(new Date(occurrence.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <FaServer className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">Source:</span>
                                <span className="font-medium text-gray-900 capitalize dark:text-white">{exception.source}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs for different sections */}
                <Tabs defaultValue="stack-trace" className="w-full">
                    <div className="border-b border-gray-200 dark:border-gray-800">
                        <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0">
                            <TabsTrigger
                                value="stack-trace"
                                className="h-12 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-blue-400"
                            >
                                Stack Trace
                            </TabsTrigger>
                            <TabsTrigger
                                value="request"
                                className="h-12 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-blue-400"
                            >
                                Request
                            </TabsTrigger>
                            <TabsTrigger
                                value="metadata"
                                className="h-12 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-blue-400"
                            >
                                Metadata
                            </TabsTrigger>
                            <TabsTrigger
                                value="breadcrumbs"
                                className="h-12 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-blue-400"
                            >
                                Breadcrumbs
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="mt-6">
                        <TabsContent value="stack-trace" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                            <div className="overflow-hidden">
                                <ExceptionStackTrace exception={exception} />
                            </div>
                        </TabsContent>

                        <TabsContent value="request" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Request Data</h3>
                                {occurrence.request_data ? (
                                    <pre className="overflow-auto rounded-lg bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                        {JSON.stringify(occurrence.request_data, null, 2)}
                                    </pre>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">No request data available</p>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="metadata" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                            <div className="overflow-hidden">
                                {/* Display occurrence metadata */}
                                <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Occurrence Metadata</h3>
                                    {occurrence.metadata ? (
                                        <pre className="overflow-auto rounded-lg bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                            {JSON.stringify(occurrence.metadata, null, 2)}
                                        </pre>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No metadata available</p>
                                    )}
                                </div>
                                
                                {/* Display exception metadata */}
                                <ExceptionMetadata exception={exception} />
                            </div>
                        </TabsContent>

                        <TabsContent value="breadcrumbs" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                            <div className="overflow-hidden">
                                <ExceptionBreadcrumbs breadcrumbs={exceptionBreadcrumbs} />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </AppLayout>
    );
}
