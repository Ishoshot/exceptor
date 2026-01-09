import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, SingleOccurrenceViewProps } from '@/types';
import { format } from 'date-fns';
import { FaArrowLeft, FaClock, FaCode, FaDatabase, FaDesktop, FaLayerGroup, FaNetworkWired, FaServer, FaUser } from 'react-icons/fa';

export default function SingleOccurrenceView({ occurrence, onBack, formatJsonData, safeString, safeRecord, hasProperty }: SingleOccurrenceViewProps) {
    return (
        <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={onBack} className="h-8 gap-1">
                        <FaArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to List</span>
                    </Button>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Occurrence Details</h2>
                </div>
                <Badge variant="outline">ID: {occurrence.id}</Badge>
            </div>

            {/* Occurrence metadata */}
            <Card className="overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">Occurrence Information</h3>
                        <div className="flex items-center gap-1.5">
                            <FaClock className="h-3.5 w-3.5 text-gray-400" />
                            <time className="text-sm text-gray-700 dark:text-gray-300">{format(new Date(occurrence.created_at), 'PPP p')}</time>
                        </div>
                    </div>
                </div>

                <CardContent className="p-0">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-transparent p-0 dark:border-gray-800">
                            <TabsTrigger
                                value="overview"
                                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-blue-400"
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="request"
                                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-blue-400"
                            >
                                Request
                            </TabsTrigger>
                            <TabsTrigger
                                value="user"
                                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-blue-400"
                            >
                                User
                            </TabsTrigger>
                            <TabsTrigger
                                value="environment"
                                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-blue-400"
                            >
                                Environment
                            </TabsTrigger>
                            <TabsTrigger
                                value="breadcrumbs"
                                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-blue-400"
                            >
                                Breadcrumbs
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="p-6 focus-visible:ring-0 focus-visible:outline-none">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Request Summary */}
                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                                    <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                                        <FaNetworkWired className="h-4 w-4 text-blue-500" />
                                        <h4 className="font-medium text-gray-900 dark:text-white">Request Summary</h4>
                                    </div>
                                    <div className="p-4">
                                        {occurrence.request_data ? (
                                            <div className="space-y-3">
                                                {hasProperty(occurrence.request_data, 'method') && (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Method</span>
                                                        <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {safeString(occurrence.request_data.method)}
                                                        </span>
                                                    </div>
                                                )}
                                                {hasProperty(occurrence.request_data, 'url') && (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">URL</span>
                                                        <span className="font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                                                            {safeString(occurrence.request_data.url)}
                                                        </span>
                                                    </div>
                                                )}
                                                {hasProperty(occurrence.request_data, 'ip') && (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">IP Address</span>
                                                        <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                            {safeString(occurrence.request_data.ip)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">No request data available</p>
                                        )}
                                    </div>
                                </div>

                                {/* User Summary */}
                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                                    <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                                        <FaUser className="h-4 w-4 text-green-500" />
                                        <h4 className="font-medium text-gray-900 dark:text-white">User Summary</h4>
                                    </div>
                                    <div className="p-4">
                                        {occurrence.user_data ? (
                                            <div className="space-y-3">
                                                {hasProperty(occurrence.user_data, 'id') && (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">User ID</span>
                                                        <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {safeString(occurrence.user_data.id)}
                                                        </span>
                                                    </div>
                                                )}
                                                {hasProperty(occurrence.user_data, 'email') && (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Email</span>
                                                        <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                            {safeString(occurrence.user_data.email)}
                                                        </span>
                                                    </div>
                                                )}
                                                {hasProperty(occurrence.user_data, 'name') && (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Name</span>
                                                        <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                            {safeString(occurrence.user_data.name)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">No user data available</p>
                                        )}
                                    </div>
                                </div>

                                {/* Environment Summary */}
                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                                    <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                                        <FaServer className="h-4 w-4 text-amber-500" />
                                        <h4 className="font-medium text-gray-900 dark:text-white">Environment Summary</h4>
                                    </div>
                                    <div className="p-4">
                                        {occurrence.environment_data ? (
                                            <div className="space-y-3">
                                                {hasProperty(occurrence.environment_data, 'PHP_VERSION') && (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">PHP Version</span>
                                                        <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {safeString(occurrence.environment_data.PHP_VERSION)}
                                                        </span>
                                                    </div>
                                                )}
                                                {hasProperty(occurrence.environment_data, 'OS') && (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Operating System</span>
                                                        <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                            {safeString(occurrence.environment_data.OS)}
                                                        </span>
                                                    </div>
                                                )}
                                                {hasProperty(occurrence.environment_data, 'SERVER_NAME') && (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Server Name</span>
                                                        <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                            {safeString(occurrence.environment_data.SERVER_NAME)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">No environment data available</p>
                                        )}
                                    </div>
                                </div>

                                {/* Breadcrumbs Summary */}
                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                                    <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                                        <FaLayerGroup className="h-4 w-4 text-purple-500" />
                                        <h4 className="font-medium text-gray-900 dark:text-white">Breadcrumbs Summary</h4>
                                    </div>
                                    <div className="p-4">
                                        {occurrence.breadcrumbs && occurrence.breadcrumbs.length > 0 ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                        {occurrence.breadcrumbs.length} breadcrumb{occurrence.breadcrumbs.length !== 1 ? 's' : ''}{' '}
                                                        recorded
                                                    </span>
                                                    <a
                                                        href="#"
                                                        className="text-xs text-blue-500 hover:underline"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            const tabTrigger = document.querySelector(`[value="breadcrumbs"]`) as HTMLElement;
                                                            if (tabTrigger) tabTrigger.click();
                                                        }}
                                                    >
                                                        View all
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {['log', 'http', 'db', 'exception'].map((type) => {
                                                        const count = (occurrence.breadcrumbs as Breadcrumb[]).filter((b) =>
                                                            b.type?.includes(type),
                                                        ).length;
                                                        if (count === 0) return null;
                                                        return (
                                                            <Badge key={type} variant="outline" className="text-xs capitalize">
                                                                {type}: {count}
                                                            </Badge>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">No breadcrumbs available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="request" className="focus-visible:ring-0 focus-visible:outline-none">
                            {occurrence.request_data ? (
                                <div className="p-6">
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="headers" className="border-b border-gray-200 dark:border-gray-800">
                                            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline dark:hover:bg-gray-800/50">
                                                <div className="flex items-center gap-2">
                                                    <FaNetworkWired className="h-4 w-4 text-blue-500" />
                                                    <span className="font-medium">Headers</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 py-3">
                                                <ScrollArea className="h-96">
                                                    <pre className="rounded-md bg-gray-800 p-4 font-mono text-xs text-white">
                                                        {formatJsonData(
                                                            safeRecord(
                                                                hasProperty(occurrence.request_data, 'headers')
                                                                    ? occurrence.request_data.headers
                                                                    : null,
                                                            ),
                                                        )}
                                                    </pre>
                                                </ScrollArea>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="cookies" className="border-b border-gray-200 dark:border-gray-800">
                                            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline dark:hover:bg-gray-800/50">
                                                <div className="flex items-center gap-2">
                                                    <FaDatabase className="h-4 w-4 text-yellow-500" />
                                                    <span className="font-medium">Cookies</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 py-3">
                                                <ScrollArea className="h-96">
                                                    <pre className="rounded-md bg-gray-800 p-4 font-mono text-xs text-white">
                                                        {formatJsonData(
                                                            safeRecord(
                                                                hasProperty(occurrence.request_data, 'cookies')
                                                                    ? occurrence.request_data.cookies
                                                                    : null,
                                                            ),
                                                        )}
                                                    </pre>
                                                </ScrollArea>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="query" className="border-b border-gray-200 dark:border-gray-800">
                                            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline dark:hover:bg-gray-800/50">
                                                <div className="flex items-center gap-2">
                                                    <FaCode className="h-4 w-4 text-green-500" />
                                                    <span className="font-medium">Query String</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 py-3">
                                                <ScrollArea className="h-96">
                                                    <pre className="rounded-md bg-gray-800 p-4 font-mono text-xs text-white">
                                                        {formatJsonData(
                                                            safeRecord(
                                                                hasProperty(occurrence.request_data, 'query') ? occurrence.request_data.query : null,
                                                            ),
                                                        )}
                                                    </pre>
                                                </ScrollArea>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="body" className="border-b-0">
                                            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline dark:hover:bg-gray-800/50">
                                                <div className="flex items-center gap-2">
                                                    <FaLayerGroup className="h-4 w-4 text-purple-500" />
                                                    <span className="font-medium">Request Body</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 py-3">
                                                <ScrollArea className="h-96">
                                                    <pre className="rounded-md bg-gray-800 p-4 font-mono text-xs text-white">
                                                        {formatJsonData(
                                                            safeRecord(
                                                                hasProperty(occurrence.request_data, 'body') ? occurrence.request_data.body : null,
                                                            ),
                                                        )}
                                                    </pre>
                                                </ScrollArea>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            ) : (
                                <div className="flex h-64 items-center justify-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No request data available</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="user" className="focus-visible:ring-0 focus-visible:outline-none">
                            {occurrence.user_data ? (
                                <div className="p-6">
                                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                                            <div className="flex items-center gap-2">
                                                <FaUser className="h-4 w-4 text-green-500" />
                                                <h4 className="font-medium text-gray-900 dark:text-white">User Data</h4>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <ScrollArea className="h-96">
                                                <pre className="rounded-md bg-gray-800 p-4 font-mono text-xs text-white">
                                                    {formatJsonData(safeRecord(occurrence.user_data))}
                                                </pre>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-64 items-center justify-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No user data available</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="environment" className="focus-visible:ring-0 focus-visible:outline-none">
                            {occurrence.environment_data ? (
                                <div className="p-6">
                                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                                            <div className="flex items-center gap-2">
                                                <FaServer className="h-4 w-4 text-amber-500" />
                                                <h4 className="font-medium text-gray-900 dark:text-white">Environment Data</h4>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <ScrollArea className="h-96">
                                                <pre className="rounded-md bg-gray-800 p-4 font-mono text-xs text-white">
                                                    {formatJsonData(safeRecord(occurrence.environment_data))}
                                                </pre>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-64 items-center justify-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No environment data available</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="breadcrumbs" className="focus-visible:ring-0 focus-visible:outline-none">
                            {occurrence.breadcrumbs && occurrence.breadcrumbs.length > 0 ? (
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {(occurrence.breadcrumbs as Breadcrumb[]).map((breadcrumb, index) => (
                                            <div
                                                key={index}
                                                className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
                                            >
                                                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                                                    <div className="flex items-center gap-2">
                                                        {breadcrumb.type?.includes('log') && <FaCode className="h-4 w-4 text-blue-500" />}
                                                        {breadcrumb.type?.includes('http') && <FaNetworkWired className="h-4 w-4 text-green-500" />}
                                                        {breadcrumb.type?.includes('db') && <FaDatabase className="h-4 w-4 text-amber-500" />}
                                                        {breadcrumb.type?.includes('exception') && <FaDesktop className="h-4 w-4 text-red-500" />}
                                                        {(!breadcrumb.type ||
                                                            (!breadcrumb.type?.includes('log') &&
                                                                !breadcrumb.type?.includes('http') &&
                                                                !breadcrumb.type?.includes('db') &&
                                                                !breadcrumb.type?.includes('exception'))) && (
                                                            <FaLayerGroup className="h-4 w-4 text-purple-500" />
                                                        )}
                                                        <span className="font-medium capitalize">{breadcrumb.type || 'Event'}</span>
                                                    </div>
                                                    {breadcrumb.timestamp && (
                                                        <div className="flex items-center gap-1.5">
                                                            <FaClock className="h-3.5 w-3.5 text-gray-400" />
                                                            <time className="text-xs text-gray-500">
                                                                {format(new Date(breadcrumb.timestamp), 'HH:mm:ss.SSS')}
                                                            </time>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    {breadcrumb.message && (
                                                        <p className="mb-2 text-sm text-gray-900 dark:text-gray-100">{breadcrumb.message}</p>
                                                    )}
                                                    {breadcrumb.data && Object.keys(breadcrumb.data).length > 0 && (
                                                        <pre className="max-h-60 overflow-auto rounded-md bg-gray-800 p-3 font-mono text-xs text-white">
                                                            {JSON.stringify(breadcrumb.data, null, 2)}
                                                        </pre>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-64 items-center justify-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No breadcrumbs available</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
