import ExceptionBreadcrumbs from '@/components/exception/exception-breadcrumbs';
import ExceptionComments from '@/components/exception/exception-comments';
import ExceptionEnvironmentBadge from '@/components/exception/exception-environment-badge';
import ExceptionLevelBadge from '@/components/exception/exception-level-badge';
import ExceptionMetadata from '@/components/exception/exception-metadata';
import ExceptionStackTrace from '@/components/exception/exception-stack-trace';
import ExceptionStatusBadge from '@/components/exception/exception-status-badge';
import ExceptionTags from '@/components/exception/exception-tags';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Exception, ExceptionComment, ExceptionOccurrence, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';
import { FaCalendarAlt, FaClock, FaExternalLinkAlt, FaServer, FaTag } from 'react-icons/fa';

interface Props {
    exception: Exception & {
        comments: ExceptionComment[];
    };
    occurrences: {
        data: ExceptionOccurrence[];
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: Array<{
                url: string | null;
                label: string;
                active: boolean;
            }>;
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    };
}

export default function Show({ exception, occurrences }: Props) {
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
    ];

    // Format exception class to be more readable
    const formatExceptionClass = (exceptionClass: string) => {
        const parts = exceptionClass.split('\\');
        return parts[parts.length - 1];
    };

    // Generate breadcrumbs
    const exceptionBreadcrumbs = useMemo(() => {
        if (exception.breadcrumbs && exception.breadcrumbs.length > 0) {
            return exception.breadcrumbs;
        }

        return [];
    }, [exception.breadcrumbs]);

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

    return (
        <AppLayout breadcrumbs={navBreadcrumbs}>
            <Head title={`Exception: ${formatExceptionClass(exception.exception_class)}`} />

            <div className="flex flex-1 flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
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
                            </div>
                            <div className="flex flex-shrink-0 flex-wrap gap-2">
                                <ExceptionStatusBadge status={exception.status} />
                                <ExceptionLevelBadge level={exception.level} />
                                <ExceptionEnvironmentBadge environment={exception.environment} />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                            <div className="flex items-center gap-1.5">
                                <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">First seen:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatDistanceToNow(new Date(exception.first_seen_at), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <FaClock className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">Last seen:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {formatDistanceToNow(new Date(exception.last_seen_at), { addSuffix: true })}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <FaTag className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">Occurrences:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{exception.occurrence_count}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <FaServer className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-700 dark:text-gray-300">Source:</span>
                                <span className="font-medium text-gray-900 capitalize dark:text-white">{exception.source}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <ExceptionTags exception={exception} />
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
                            <TabsTrigger
                                value="comments"
                                className="h-12 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-blue-400"
                            >
                                Comments
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="mt-6">
                        <TabsContent value="stack-trace" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                            <div className="overflow-hidden">
                                <ExceptionStackTrace exception={exception} />
                            </div>
                        </TabsContent>

                        <TabsContent value="metadata" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                            <div className="overflow-hidden">
                                <ExceptionMetadata exception={exception} />
                            </div>
                        </TabsContent>

                        <TabsContent value="breadcrumbs" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                            <div className="overflow-hidden">
                                <ExceptionBreadcrumbs breadcrumbs={exceptionBreadcrumbs} />
                            </div>
                        </TabsContent>

                        <TabsContent value="comments" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                            <div className="overflow-hidden">
                                <ExceptionComments exception={exception} comments={exception.comments} />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                {/* Occurrences Table Section */}
                <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Exception Occurrences</h2>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {occurrences && occurrences.meta ? `${occurrences.meta.total} occurrence${occurrences.meta.total !== 1 ? 's' : ''} found` : 'Loading occurrences...'}
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 dark:border-gray-800">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {occurrences && occurrences.data.map((occurrence) => (
                                    <TableRow key={occurrence.id}>
                                        <TableCell className="font-mono text-xs">
                                            {occurrence.id.substring(0, 8)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {format(new Date(occurrence.created_at), 'MMM d, yyyy HH:mm:ss')}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDistanceToNow(new Date(occurrence.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate font-mono text-xs">
                                            {occurrence.request_data && occurrence.request_data.url ? (
                                                <span title={String(occurrence.request_data.url)}>
                                                    {String(occurrence.request_data.url).substring(0, 40)}
                                                    {String(occurrence.request_data.url).length > 40 ? '...' : ''}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {occurrence.user_data && occurrence.user_data.email ? (
                                                <span className="font-mono text-xs">
                                                    {String(occurrence.user_data.email)}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={route('exceptions.occurrences.show', { exception: exception.id, occurrence: occurrence.id })}>
                                                <div className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
                                                    View
                                                    <FaExternalLinkAlt className="h-3 w-3" />
                                                </div>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {occurrences && occurrences.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <span className="text-gray-500 dark:text-gray-400">No occurrences found</span>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination links - render if you have a lot of occurrences */}
                    {occurrences && occurrences.meta && occurrences.meta.last_page > 1 && (
                        <div className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800 sm:px-6">
                            <div className="flex flex-1 justify-between sm:hidden">
                                {occurrences.meta.links[0] && (
                                    <Link
                                        href={occurrences.meta.links[0].url || '#'}
                                        className={cn(
                                            'relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium',
                                            occurrences.meta.current_page === 1
                                                ? 'pointer-events-none text-gray-400'
                                                : 'text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800'
                                        )}
                                    >
                                        Previous
                                    </Link>
                                )}
                                {occurrences.meta.links[occurrences.meta.links.length - 1] && (
                                    <Link
                                        href={occurrences.meta.links[occurrences.meta.links.length - 1].url || '#'}
                                        className={cn(
                                            'relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium',
                                            occurrences.meta.current_page === occurrences.meta.last_page
                                                ? 'pointer-events-none text-gray-400'
                                                : 'text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-800'
                                        )}
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    {occurrences.meta && (
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Showing <span className="font-medium">{occurrences.meta.from}</span> to{' '}
                                            <span className="font-medium">{occurrences.meta.to}</span> of{' '}
                                            <span className="font-medium">{occurrences.meta.total}</span> results
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        {occurrences.meta && occurrences.meta.links.map((link, i) => {
                                            // Skip the "Previous" and "Next" links as we'll handle them separately
                                            if (i === 0 || i === occurrences.meta.links.length - 1) return null;

                                            return (
                                                <Link
                                                    key={i}
                                                    href={link.url || '#'}
                                                    className={cn(
                                                        'relative inline-flex items-center px-4 py-2 text-sm font-medium',
                                                        link.active
                                                            ? 'z-10 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                            : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800',
                                                        i === 1 ? 'rounded-l-md' : '',
                                                        i === occurrences.meta.links.length - 2 ? 'rounded-r-md' : ''
                                                    )}
                                                    aria-current={link.active ? 'page' : undefined}
                                                >
                                                    {link.label.includes('Previous') || link.label.includes('Next')
                                                        ? ''
                                                        : link.label}
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
