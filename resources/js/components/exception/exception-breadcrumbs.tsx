import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import {
    FaChevronDown,
    FaChevronRight,
    FaClock,
    FaCode,
    FaDatabase,
    FaExchangeAlt,
    FaExclamationCircle,
    FaInfoCircle,
    FaNetworkWired,
    FaSearch,
} from 'react-icons/fa';

interface BreadcrumbItem {
    id: string;
    type: 'exception' | 'log.info' | 'log.debug' | 'http' | 'db.sql.query' | string;
    timestamp: string;
    data: Record<string, any>;
    level?: 'info' | 'debug' | 'error' | 'warning';
    category?: string;
    message?: string;
}

interface ExceptionBreadcrumbsProps {
    breadcrumbs: BreadcrumbItem[];
}

export default function ExceptionBreadcrumbs({ breadcrumbs }: ExceptionBreadcrumbsProps) {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [selectedBreadcrumb, setSelectedBreadcrumb] = useState<BreadcrumbItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [useRelativeTimestamp, setUseRelativeTimestamp] = useState(true);

    const toggleExpand = (id: string) => {
        setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    const isExpanded = (id: string) => expandedItems.includes(id);

    const formatTimestamp = (timestamp: string) => {
        try {
            const date = new Date(timestamp);
            if (useRelativeTimestamp) {
                // Simple relative time formatting
                const now = new Date();
                const diffMs = now.getTime() - date.getTime();
                const diffSec = Math.floor(diffMs / 1000);

                if (diffSec < 60) return `${diffSec}s ago`;
                if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
                if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
                return `${Math.floor(diffSec / 86400)}d ago`;
            } else {
                return format(date, 'HH:mm:ss.SSS');
            }
        } catch (e) {
            return timestamp;
        }
    };

    const getBreadcrumbIcon = (type: string) => {
        if (type.startsWith('exception')) return <FaExclamationCircle className="h-4 w-4 flex-shrink-0 text-red-500" />;
        if (type.startsWith('log.info')) return <FaInfoCircle className="h-4 w-4 flex-shrink-0 text-blue-500" />;
        if (type.startsWith('log.debug')) return <FaCode className="h-4 w-4 flex-shrink-0 text-gray-500" />;
        if (type.startsWith('http')) return <FaNetworkWired className="h-4 w-4 flex-shrink-0 text-green-500" />;
        if (type.startsWith('db')) return <FaDatabase className="h-4 w-4 flex-shrink-0 text-yellow-500" />;
        if (type.startsWith('search')) return <FaSearch className="h-4 w-4 flex-shrink-0 text-purple-500" />;
        return <FaExchangeAlt className="h-4 w-4 flex-shrink-0 text-gray-500" />;
    };

    const getBreadcrumbLevelColor = (level?: string) => {
        switch (level) {
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'info':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'debug':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    const getBreadcrumbTitle = (breadcrumb: BreadcrumbItem) => {
        if (breadcrumb.type === 'exception') {
            return breadcrumb.data.message || 'Exception';
        }
        if (breadcrumb.type.startsWith('log.')) {
            return breadcrumb.message || breadcrumb.data.message || breadcrumb.type.replace('log.', '');
        }
        if (breadcrumb.type === 'http') {
            const method = breadcrumb.data.method || breadcrumb.data['http.request.method'];
            const url = breadcrumb.data.url || breadcrumb.data['http.request.url'] || 'API request';
            const status = breadcrumb.data.status || breadcrumb.data['http.response.status_code'];
            return `${method || 'HTTP'} ${url ? `to ${url}` : ''} ${status ? `(${status})` : ''}`;
        }
        if (breadcrumb.type.startsWith('db.sql')) {
            return breadcrumb.data.query || 'Database Query';
        }
        return breadcrumb.message || breadcrumb.type;
    };

    const renderBreadcrumbContent = (breadcrumb: BreadcrumbItem) => {
        if (breadcrumb.type === 'http') {
            // Always show some content for HTTP, even if specific fields aren't available
            const hasSpecificFields =
                breadcrumb.data['http.fragment'] ||
                breadcrumb.data['http.query'] ||
                breadcrumb.data['http.request.method'] ||
                breadcrumb.data['http.request.body.size'] ||
                breadcrumb.data['http.response.body.size'] ||
                breadcrumb.data['http.response.status_code'];

            if (!hasSpecificFields) {
                // If no specific HTTP fields, show the raw data
                return (
                    <div className="space-y-2">
                        <div className="text-xs">
                            <span className="font-medium text-gray-500">HTTP Request/Response Data:</span>
                        </div>
                        <pre className="overflow-auto rounded bg-gray-800 p-2 font-mono text-xs text-white">
                            {JSON.stringify(breadcrumb.data, null, 2) || '{ }'}
                        </pre>
                    </div>
                );
            }

            return (
                <div className="space-y-2">
                    {breadcrumb.data['http.fragment'] && (
                        <div className="text-xs">
                            <span className="font-medium text-gray-500">Fragment: </span>
                            <span className="font-mono">{breadcrumb.data['http.fragment']}</span>
                        </div>
                    )}
                    {breadcrumb.data['http.query'] && (
                        <div className="text-xs">
                            <span className="font-medium text-gray-500">Query: </span>
                            <span className="font-mono">{breadcrumb.data['http.query']}</span>
                        </div>
                    )}
                    {breadcrumb.data['http.request.method'] && (
                        <div className="text-xs">
                            <span className="font-medium text-gray-500">Method: </span>
                            <span className="font-mono">{breadcrumb.data['http.request.method']}</span>
                        </div>
                    )}
                    {breadcrumb.data['http.request.body.size'] && (
                        <div className="text-xs">
                            <span className="font-medium text-gray-500">Request Body Size: </span>
                            <span className="font-mono">{breadcrumb.data['http.request.body.size']} bytes</span>
                        </div>
                    )}
                    {breadcrumb.data['http.response.body.size'] && (
                        <div className="text-xs">
                            <span className="font-medium text-gray-500">Response Body Size: </span>
                            <span className="font-mono">{breadcrumb.data['http.response.body.size']} bytes</span>
                        </div>
                    )}
                    {breadcrumb.data['http.response.status_code'] && (
                        <div className="text-xs">
                            <span className="font-medium text-gray-500">Status Code: </span>
                            <span className="font-mono">{breadcrumb.data['http.response.status_code']}</span>
                        </div>
                    )}
                </div>
            );
        }

        if (breadcrumb.type.startsWith('db.sql')) {
            return (
                <div className="space-y-2">
                    {breadcrumb.data.query && (
                        <div className="text-xs">
                            <div className="mb-1 font-medium text-gray-500">Query:</div>
                            <pre className="overflow-auto rounded bg-gray-800 p-2 font-mono text-xs text-white">{breadcrumb.data.query}</pre>
                        </div>
                    )}
                    {breadcrumb.data.connectionName && (
                        <div className="text-xs">
                            <span className="font-medium text-gray-500">Connection: </span>
                            <span className="font-mono">{breadcrumb.data.connectionName}</span>
                        </div>
                    )}
                    {breadcrumb.data.executionTimeMs && (
                        <div className="text-xs">
                            <span className="font-medium text-gray-500">Execution Time: </span>
                            <span className="font-mono">{breadcrumb.data.executionTimeMs} ms</span>
                        </div>
                    )}
                </div>
            );
        }

        if (breadcrumb.type.startsWith('log.')) {
            return (
                <div className="space-y-2">
                    {breadcrumb.data.message && (
                        <div className="text-xs">
                            <span className="font-medium text-gray-500">Message: </span>
                            <span className="font-mono">{breadcrumb.data.message}</span>
                        </div>
                    )}
                    {breadcrumb.data.context && (
                        <div className="text-xs">
                            <div className="mb-1 font-medium text-gray-500">Context:</div>
                            <pre className="overflow-auto rounded bg-gray-800 p-2 font-mono text-xs text-white">
                                {JSON.stringify(breadcrumb.data.context, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            );
        }

        // Fallback for other types or when specific rendering is not defined
        return (
            <div className="space-y-2">
                <pre className="overflow-auto rounded bg-gray-800 p-2 font-mono text-xs text-white">
                    {JSON.stringify(breadcrumb.data, null, 2) || '{ }'}
                </pre>
            </div>
        );
    };

    const renderDetailView = (breadcrumb: BreadcrumbItem) => {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 overflow-hidden">
                        {getBreadcrumbIcon(breadcrumb.type)}
                        <h3 className="truncate text-lg font-medium">{getBreadcrumbTitle(breadcrumb)}</h3>
                    </div>
                    <Badge className={getBreadcrumbLevelColor(breadcrumb.level)}>{breadcrumb.level || 'info'}</Badge>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 dark:divide-gray-700">
                        <div className="p-4">
                            <h4 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Type</h4>
                            <p className="font-mono text-sm break-all">{breadcrumb.type}</p>
                        </div>
                        <div className="p-4">
                            <h4 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Timestamp</h4>
                            <p className="font-mono text-sm">{new Date(breadcrumb.timestamp).toLocaleString()}</p>
                        </div>
                    </div>

                    {breadcrumb.category && (
                        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                            <h4 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Category</h4>
                            <p className="font-mono text-sm break-all">{breadcrumb.category}</p>
                        </div>
                    )}

                    <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                        <h4 className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">Data</h4>
                        {breadcrumb.type.startsWith('http') && (
                            <div className="space-y-3">
                                <h5 className="text-xs font-medium text-gray-500">HTTP Request/Response Data:</h5>
                                <div className="max-w-full overflow-hidden">
                                    <pre className="overflow-x-auto rounded-md bg-gray-800 p-3 font-mono text-xs leading-relaxed text-white">
                                        {JSON.stringify(breadcrumb.data, null, 2) || '{ }'}
                                    </pre>
                                </div>
                            </div>
                        )}
                        {!breadcrumb.type.startsWith('http') && renderBreadcrumbContent(breadcrumb)}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Timeline</h3>
                <Button variant="outline" size="sm" onClick={() => setUseRelativeTimestamp(!useRelativeTimestamp)} className="h-8 gap-1.5 text-xs">
                    <FaClock className="h-3 w-3" />
                    {useRelativeTimestamp ? 'Absolute Time' : 'Relative Time'}
                </Button>
            </div>

            <div className="overflow-hidden bg-white dark:bg-gray-900">
                <ScrollArea className="h-[700px]">
                    <div className="space-y-3">
                        {breadcrumbs.length > 0 ? (
                            <div className="relative">
                                <div className="absolute top-0 bottom-0 left-[31px] w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                                {breadcrumbs.map((breadcrumb, index) => (
                                    <Collapsible
                                        key={breadcrumb.id}
                                        open={isExpanded(breadcrumb.id)}
                                        onOpenChange={() => toggleExpand(breadcrumb.id)}
                                        className="relative mb-3 overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-sm dark:border-gray-700 dark:bg-gray-900"
                                    >
                                        <div
                                            className="flex min-h-[50px] cursor-pointer items-center justify-between p-3"
                                            onClick={() => toggleExpand(breadcrumb.id)}
                                        >
                                            <div className="flex flex-1 items-center space-x-3 overflow-hidden">
                                                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm dark:bg-gray-800">
                                                    {getBreadcrumbIcon(breadcrumb.type)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {breadcrumb.type.split('.')[0]}
                                                        </span>
                                                        <Badge className={cn('text-xs', getBreadcrumbLevelColor(breadcrumb.level))}>
                                                            {breadcrumb.level || 'info'}
                                                        </Badge>
                                                    </div>
                                                    <span className="mt-0.5 block text-sm break-words text-gray-600 dark:text-gray-400">
                                                        {getBreadcrumbTitle(breadcrumb)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-2 flex flex-shrink-0 items-center space-x-2">
                                                <span className="text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                    {formatTimestamp(breadcrumb.timestamp)}
                                                </span>
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 flex-shrink-0 p-0"
                                                        onClick={(e) => {
                                                            // Prevent the parent div's onClick from firing
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        {isExpanded(breadcrumb.id) ? (
                                                            <FaChevronDown className="h-3 w-3" />
                                                        ) : (
                                                            <FaChevronRight className="h-3 w-3" />
                                                        )}
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <Dialog
                                                    open={isDetailOpen && selectedBreadcrumb?.id === breadcrumb.id}
                                                    onOpenChange={(open) => {
                                                        setIsDetailOpen(open);
                                                        if (!open) setSelectedBreadcrumb(null);
                                                    }}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="mt-0.5 h-6 w-6 flex-shrink-0 p-0"
                                                            onClick={(e) => {
                                                                // Prevent the parent div's onClick from firing
                                                                e.stopPropagation();
                                                                setSelectedBreadcrumb(breadcrumb);
                                                                setIsDetailOpen(true);
                                                            }}
                                                        >
                                                            <FaSearch className="h-3 w-3" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader className="border-b border-gray-200 pb-4 dark:border-gray-700">
                                                            <DialogTitle className="text-xl font-semibold">Breadcrumb Details</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="max-h-[80vh] overflow-y-auto">
                                                            {selectedBreadcrumb && renderDetailView(selectedBreadcrumb)}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                        <CollapsibleContent className="border-t border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                                            {renderBreadcrumbContent(breadcrumb)}
                                        </CollapsibleContent>
                                    </Collapsible>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-40 items-center justify-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">No breadcrumbs available</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
