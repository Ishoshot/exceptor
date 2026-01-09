import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExceptionMetadataProps } from '@/types';
import {
    FaBoxOpen,
    FaCode,
    FaCog,
    FaDatabase,
    FaExternalLinkAlt,
    FaLayerGroup,
    FaNetworkWired,
    FaSearch,
    FaServer,
    FaTag,
    FaUser,
} from 'react-icons/fa';

export default function ExceptionMetadata({ exception }: ExceptionMetadataProps) {
    // Extract runtime data from environment_data if available
    const runtimeData = {
        php: exception.environment_data?.PHP_VERSION as string,
        name: 'php',
        server_name: exception.environment_data?.SERVER_NAME as string,
        sapi: exception.environment_data?.PHP_SAPI as string,
        version: exception.environment_data?.PHP_VERSION as string,
    };

    // Extract OS data from environment_data if available
    const osData = {
        name: exception.environment_data?.OS,
        version: exception.environment_data?.OS_VERSION,
        build: exception.environment_data?.OS_BUILD,
        kernel_version: exception.environment_data?.KERNEL_VERSION,
    };

    // Extract user data if available
    const userData = exception.user_data || {};

    // Extract trace data
    const traceData = {
        trace_id: exception.environment_data?.TRACE_ID,
    };

    // Extract packages from environment_data if available
    const getPackages = () => {
        // If we have composer packages in environment data, use those
        if (exception.environment_data?.COMPOSER_PACKAGES) {
            try {
                return JSON.parse(exception.environment_data.COMPOSER_PACKAGES as string);
            } catch (e) {
                // If we can't parse the JSON, return an empty object
                return {};
            }
        }

        // Return only the data we have
        return {
            'laravel/framework': exception.environment_data?.LARAVEL_VERSION,
            php: runtimeData.php,
        };
    };

    const packages = getPackages();

    // Extract tags from exception
    const tags = {
        environment: exception.environment,
        level: exception.level,
        handled: exception.environment_data?.HANDLED,
        mechanism: exception.environment_data?.MECHANISM,
        os: osData.name,
        runtime: runtimeData.name,
        php: runtimeData.php,
    };

    // Function to render a tag
    const renderTag = (key: string, value: string) => (
        <div
            key={key}
            className="flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-2 shadow-sm transition-all hover:border-gray-200 hover:shadow dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700"
        >
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{key}</span>
            <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{value}</span>
        </div>
    );

    // Function to render a package with link
    const renderPackage = (name: string, version: string) => {
        const isLaravel = name.startsWith('laravel/');
        const isSymfony = name.startsWith('symfony/');
        const isSpatie = name.startsWith('spatie/');

        let repoUrl = '';
        if (isLaravel) {
            repoUrl = `https://github.com/laravel/${name.replace('laravel/', '')}`;
        } else if (isSymfony) {
            repoUrl = `https://github.com/symfony/${name.replace('symfony/', '')}`;
        } else if (isSpatie) {
            repoUrl = `https://github.com/spatie/${name.replace('spatie/', '')}`;
        } else if (name === 'php') {
            repoUrl = 'https://www.php.net/';
        } else {
            // Extract vendor and package
            const [vendor, pkg] = name.split('/');
            if (vendor && pkg) {
                repoUrl = `https://github.com/${vendor}/${pkg}`;
            }
        }

        return (
            <div
                key={name}
                className="flex items-center justify-between rounded-lg border border-transparent p-2 transition-all hover:border-gray-200 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-800/50"
            >
                <div className="flex items-center gap-1.5">
                    <FaBoxOpen className="h-3 w-3 text-gray-400" />
                    <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                        {version}
                    </Badge>
                    {repoUrl && (
                        <a
                            href={repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <FaExternalLinkAlt className="h-3 w-3 text-blue-500" />
                        </a>
                    )}
                </div>
            </div>
        );
    };

    // Helper function to safely convert unknown to string
    const safeString = (value: unknown): string => {
        if (value === null || value === undefined) return '';
        return String(value);
    };

    return (
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 w-full justify-start rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900/50">
                <TabsTrigger
                    value="overview"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
                >
                    Overview
                </TabsTrigger>
                <TabsTrigger
                    value="packages"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
                >
                    Packages
                </TabsTrigger>
                <TabsTrigger
                    value="request"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
                >
                    Request
                </TabsTrigger>
                <TabsTrigger
                    value="environment"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
                >
                    Environment
                </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                <div className="space-y-8">
                    {/* Tags Section */}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaTag className="h-4 w-4 text-gray-500" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h3>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                                    All
                                </Badge>
                                <Badge variant="outline">Custom</Badge>
                                <Badge variant="outline">Application</Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {Object.entries(tags).map(([key, value]) => renderTag(key, String(value)))}
                        </div>
                    </div>

                    {/* Contexts Section */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <FaCog className="h-4 w-4 text-gray-500" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contexts</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* User Context */}
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                                    <div className="flex items-center gap-2">
                                        <FaUser className="h-4 w-4 text-blue-500" />
                                        <h4 className="font-medium text-gray-900 dark:text-white">User</h4>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Geography</span>
                                            <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                {safeString(userData.geography)}
                                            </span>
                                        </div>
                                        {exception.user_data && (
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">User ID</span>
                                                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                    {String(exception.user_data.id || 'Unknown')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Operating System Context */}
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                                    <div className="flex items-center gap-2">
                                        <FaServer className="h-4 w-4 text-amber-500" />
                                        <h4 className="font-medium text-gray-900 dark:text-white">Operating System</h4>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Name</span>
                                                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{String(osData.name)}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Version</span>
                                                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{String(osData.version)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Build</span>
                                            <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{String(osData.build)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Runtime Context */}
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                                    <div className="flex items-center gap-2">
                                        <FaCode className="h-4 w-4 text-blue-500" />
                                        <h4 className="font-medium text-gray-900 dark:text-white">Runtime</h4>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Name</span>
                                            <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{String(runtimeData.name)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Version</span>
                                            <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{String(runtimeData.version)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">SAPI</span>
                                            <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{String(runtimeData.sapi)}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Server</span>
                                            <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                {String(runtimeData.server_name)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trace Details Context */}
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
                                    <div className="flex items-center gap-2">
                                        <FaLayerGroup className="h-4 w-4 text-purple-500" />
                                        <h4 className="font-medium text-gray-900 dark:text-white">Trace Details</h4>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">Trace ID</span>
                                            <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                <a href="#" className="text-blue-500 hover:underline">
                                                    {String(traceData.trace_id)}
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="packages" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                <div className="space-y-4">
                    <div className="mb-4 flex items-center gap-2">
                        <FaBoxOpen className="h-4 w-4 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Packages</h3>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                        <div className="border-b border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900/50">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search packages..."
                                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <FaSearch className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        <div className="max-h-[500px] overflow-auto">
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-2 lg:grid-cols-3">
                                {Object.entries(packages).map(([name, version]) => renderPackage(name, String(version)))}
                            </div>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="request" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                {exception.request_data ? (
                    <div className="space-y-4">
                        <div className="mb-4 flex items-center gap-2">
                            <FaNetworkWired className="h-4 w-4 text-gray-500" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request Data</h3>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="headers" className="border-b-0">
                                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline dark:hover:bg-gray-800/50">
                                        <div className="flex items-center gap-2">
                                            <FaNetworkWired className="h-4 w-4 text-blue-500" />
                                            <span className="font-medium">Headers</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="bg-gray-50 px-4 py-3 dark:bg-gray-800/20">
                                        <pre className="overflow-auto rounded-md bg-gray-800 p-4 font-mono text-xs text-white">
                                            {JSON.stringify(exception.request_data.headers || {}, null, 2) as string}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="cookies" className="border-b-0">
                                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline dark:hover:bg-gray-800/50">
                                        <div className="flex items-center gap-2">
                                            <FaDatabase className="h-4 w-4 text-yellow-500" />
                                            <span className="font-medium">Cookies</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="bg-gray-50 px-4 py-3 dark:bg-gray-800/20">
                                        <pre className="overflow-auto rounded-md bg-gray-800 p-4 font-mono text-xs text-white">
                                            {JSON.stringify(exception.request_data.cookies || {}, null, 2) as string}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="query" className="border-b-0">
                                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline dark:hover:bg-gray-800/50">
                                        <div className="flex items-center gap-2">
                                            <FaCode className="h-4 w-4 text-green-500" />
                                            <span className="font-medium">Query String</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="bg-gray-50 px-4 py-3 dark:bg-gray-800/20">
                                        <pre className="overflow-auto rounded-md bg-gray-800 p-4 font-mono text-xs text-white">
                                            {JSON.stringify(exception.request_data.query || {}, null, 2) as string}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="body" className="border-b-0">
                                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline dark:hover:bg-gray-800/50">
                                        <div className="flex items-center gap-2">
                                            <FaLayerGroup className="h-4 w-4 text-purple-500" />
                                            <span className="font-medium">Request Body</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="bg-gray-50 px-4 py-3 dark:bg-gray-800/20">
                                        <pre className="overflow-auto rounded-md bg-gray-800 p-4 font-mono text-xs text-white">
                                            {JSON.stringify(exception.request_data.body || {}, null, 2) as string}
                                        </pre>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="user-agent" className="border-b-0">
                                    <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline dark:hover:bg-gray-800/50">
                                        <div className="flex items-center gap-2">
                                            <FaNetworkWired className="h-4 w-4 text-blue-500" />
                                            <span className="font-medium">User Agent</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="bg-gray-50 px-4 py-3 dark:bg-gray-800/20">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">User Agent</span>
                                                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                    {safeString(exception.request_data?.HTTP_USER_AGENT)}
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No request data available</p>
                    </div>
                )}
            </TabsContent>

            <TabsContent value="environment" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
                {exception.environment_data ? (
                    <div className="space-y-4">
                        <div className="mb-4 flex items-center gap-2">
                            <FaCog className="h-4 w-4 text-gray-500" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Environment Data</h3>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                            <div className="border-b border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900/50">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Filter environment variables..."
                                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <FaSearch className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="max-h-[500px] overflow-auto rounded-md bg-gray-800 p-4 font-mono text-xs text-white">
                                    {JSON.stringify(exception.environment_data, null, 2) as string}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No environment data available</p>
                    </div>
                )}
            </TabsContent>
        </Tabs>
    );
}
