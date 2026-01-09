import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import {
    FaAndroid,
    FaApple,
    FaCalendarAlt,
    FaChartLine,
    FaCheckCircle,
    FaChrome,
    FaClipboard,
    FaCode,
    FaDesktop,
    FaEdge,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaFirefox,
    FaGlobe,
    FaHistory,
    FaLinux,
    FaSafari,
    FaServer,
    FaTag,
    FaTimes,
    FaUserCircle,
    FaUserFriends,
    FaWindows,
} from 'react-icons/fa';

interface RecentError {
    id: string;
    message: string;
    type: string;
    count: number;
    first_seen: string;
    last_seen: string;
    status: 'unresolved' | 'resolved' | 'muted';
    environment: string;
    browser?: string;
    os?: string;
    user_count?: number;
    stack_trace?: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high' | 'critical';
    assigned_to?: string;
}

interface ErrorDetailsProps {
    error: RecentError;
    onClose: () => void;
}

export const ErrorDetails: React.FC<ErrorDetailsProps> = ({ error, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Get status badge
    const getStatusBadge = () => {
        switch (error.status) {
            case 'resolved':
                return (
                    <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <FaCheckCircle className="mr-1 h-3 w-3" />
                        Resolved
                    </div>
                );
            case 'unresolved':
                return error.priority === 'critical' ? (
                    <div className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        <FaExclamationCircle className="mr-1 h-3 w-3" />
                        Critical
                    </div>
                ) : (
                    <div className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        <FaExclamationTriangle className="mr-1 h-3 w-3" />
                        Unresolved
                    </div>
                );
            case 'muted':
                return (
                    <div className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        <FaExclamationTriangle className="mr-1 h-3 w-3" />
                        Muted
                    </div>
                );
            default:
                return (
                    <div className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        <FaExclamationTriangle className="mr-1 h-3 w-3" />
                        Unresolved
                    </div>
                );
        }
    };

    // Get browser icon
    const getBrowserIcon = () => {
        if (!error.browser) return null;

        if (error.browser.toLowerCase().includes('chrome')) {
            return <FaChrome className="mr-1 h-4 w-4 text-blue-500" />;
        } else if (error.browser.toLowerCase().includes('firefox')) {
            return <FaFirefox className="mr-1 h-4 w-4 text-orange-500" />;
        } else if (error.browser.toLowerCase().includes('safari')) {
            return <FaSafari className="mr-1 h-4 w-4 text-blue-500" />;
        } else if (error.browser.toLowerCase().includes('edge')) {
            return <FaEdge className="mr-1 h-4 w-4 text-blue-500" />;
        } else {
            return <FaGlobe className="mr-1 h-4 w-4 text-gray-500" />;
        }
    };

    // Get OS icon
    const getOSIcon = () => {
        if (!error.os) return null;

        if (error.os.toLowerCase().includes('windows')) {
            return <FaWindows className="mr-1 h-4 w-4 text-blue-500" />;
        } else if (error.os.toLowerCase().includes('mac') || error.os.toLowerCase().includes('ios')) {
            return <FaApple className="mr-1 h-4 w-4 text-gray-500" />;
        } else if (error.os.toLowerCase().includes('linux')) {
            return <FaLinux className="mr-1 h-4 w-4 text-yellow-500" />;
        } else if (error.os.toLowerCase().includes('android')) {
            return <FaAndroid className="mr-1 h-4 w-4 text-green-500" />;
        } else {
            return <FaDesktop className="mr-1 h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                    <div className="flex items-center">
                        {error.status === 'resolved' ? (
                            <FaCheckCircle className="mr-3 h-5 w-5 text-green-500" />
                        ) : error.priority === 'critical' ? (
                            <FaExclamationCircle className="mr-3 h-5 w-5 text-red-500" />
                        ) : (
                            <FaExclamationTriangle className="mr-3 h-5 w-5 text-yellow-500" />
                        )}
                        <h2 className="max-w-lg truncate text-lg font-medium text-gray-900 dark:text-white">{error.type}</h2>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FaTimes className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-4 px-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`border-b-2 px-1 py-3 text-sm font-medium ${
                                activeTab === 'overview'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('stack-trace')}
                            className={`border-b-2 px-1 py-3 text-sm font-medium ${
                                activeTab === 'stack-trace'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            Stack Trace
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`border-b-2 px-1 py-3 text-sm font-medium ${
                                activeTab === 'history'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            History
                        </button>
                        <button
                            onClick={() => setActiveTab('similar')}
                            className={`border-b-2 px-1 py-3 text-sm font-medium ${
                                activeTab === 'similar'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                        >
                            Similar Errors
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="p-6"
                        >
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* Error Message */}
                                    <div>
                                        <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Error Message</h3>
                                        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-900 dark:bg-gray-700 dark:text-white">
                                            {error.message}
                                        </div>
                                    </div>

                                    {/* Error Details */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        <div>
                                            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Details</h3>
                                            <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                                <div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                                                    <div className="mt-1">{getStatusBadge()}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Environment</div>
                                                    <div className="mt-1 flex items-center text-sm text-gray-900 dark:text-white">
                                                        <FaServer className="mr-1 h-4 w-4 text-gray-400" />
                                                        {error.environment}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Occurrences</div>
                                                    <div className="mt-1 text-sm text-gray-900 dark:text-white">{error.count} times</div>
                                                </div>
                                                {error.user_count && (
                                                    <div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Affected Users</div>
                                                        <div className="mt-1 flex items-center text-sm text-gray-900 dark:text-white">
                                                            <FaUserFriends className="mr-1 h-4 w-4 text-gray-400" />
                                                            {error.user_count} users
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Timing</h3>
                                            <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                                <div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">First Seen</div>
                                                    <div className="mt-1 flex items-center text-sm text-gray-900 dark:text-white">
                                                        <FaCalendarAlt className="mr-1 h-4 w-4 text-gray-400" />
                                                        {formatDate(error.first_seen)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Last Seen</div>
                                                    <div className="mt-1 flex items-center text-sm text-gray-900 dark:text-white">
                                                        <FaCalendarAlt className="mr-1 h-4 w-4 text-gray-400" />
                                                        {formatDate(error.last_seen)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                                                    <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                                        {Math.floor(
                                                            (new Date(error.last_seen).getTime() - new Date(error.first_seen).getTime()) /
                                                                (1000 * 60 * 60 * 24),
                                                        )}{' '}
                                                        days
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Context</h3>
                                            <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                                {error.browser && (
                                                    <div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Browser</div>
                                                        <div className="mt-1 flex items-center text-sm text-gray-900 dark:text-white">
                                                            {getBrowserIcon()}
                                                            {error.browser}
                                                        </div>
                                                    </div>
                                                )}

                                                {error.os && (
                                                    <div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Operating System</div>
                                                        <div className="mt-1 flex items-center text-sm text-gray-900 dark:text-white">
                                                            {getOSIcon()}
                                                            {error.os}
                                                        </div>
                                                    </div>
                                                )}

                                                {error.assigned_to && (
                                                    <div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Assigned To</div>
                                                        <div className="mt-1 flex items-center text-sm text-gray-900 dark:text-white">
                                                            <FaUserCircle className="mr-1 h-4 w-4 text-gray-400" />
                                                            {error.assigned_to}
                                                        </div>
                                                    </div>
                                                )}

                                                {error.tags && error.tags.length > 0 && (
                                                    <div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Tags</div>
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {error.tags.map((tag, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                                                                >
                                                                    <FaTag className="mr-1 h-2 w-2" />
                                                                    {tag}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error Trend */}
                                    <div>
                                        <h3 className="mb-2 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                            <FaChartLine className="mr-1 h-4 w-4" />
                                            Error Trend
                                        </h3>
                                        <div className="flex h-48 items-center justify-center rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                Error trend visualization would appear here
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'stack-trace' && (
                                <div>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                            <FaCode className="mr-1 h-4 w-4" />
                                            Stack Trace
                                        </h3>
                                        <button
                                            onClick={() => {
                                                // In a real app, this would copy the stack trace to clipboard
                                                console.log('Copy stack trace to clipboard');
                                            }}
                                            className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/40"
                                        >
                                            <FaClipboard className="mr-1 h-3 w-3" />
                                            Copy
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                        <pre className="font-mono text-xs whitespace-pre-wrap text-gray-900 dark:text-white">
                                            {error.stack_trace || 'No stack trace available for this error.'}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                            <FaHistory className="mr-1 h-4 w-4" />
                                            Error History
                                        </h3>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 rounded-full bg-blue-100 p-1 dark:bg-blue-900/30">
                                                    <FaCalendarAlt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">First occurrence</p>
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatDate(error.first_seen)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 rounded-full bg-yellow-100 p-1 dark:bg-yellow-900/30">
                                                    <FaExclamationTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Error frequency increased</p>
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(new Date(error.last_seen).getTime() - 86400000 * 3).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {error.assigned_to && (
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 rounded-full bg-purple-100 p-1 dark:bg-purple-900/30">
                                                        <FaUserCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            Assigned to {error.assigned_to}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                            {new Date(new Date(error.last_seen).getTime() - 86400000 * 2).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 rounded-full bg-red-100 p-1 dark:bg-red-900/30">
                                                    <FaExclamationCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        Marked as {error.priority || 'high'} priority
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(new Date(error.last_seen).getTime() - 86400000).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 rounded-full bg-gray-100 p-1 dark:bg-gray-600">
                                                    <FaCalendarAlt className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Most recent occurrence</p>
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatDate(error.last_seen)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'similar' && (
                                <div>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Similar Errors</h3>
                                    </div>

                                    <div className="flex h-48 items-center justify-center rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">No similar errors found</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <button
                            className={`inline-flex items-center rounded-md border border-transparent px-3 py-1.5 text-sm leading-4 font-medium text-white shadow-sm ${
                                error.status === 'resolved' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'
                            } focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none`}
                        >
                            <FaCheckCircle className="mr-1.5 h-4 w-4" />
                            {error.status === 'resolved' ? 'Unresolve' : 'Resolve'}
                        </button>

                        <button
                            className={`inline-flex items-center rounded-md border border-transparent px-3 py-1.5 text-sm leading-4 font-medium text-white shadow-sm ${
                                error.status === 'muted' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
                            } focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none`}
                        >
                            {error.status === 'muted' ? (
                                <>
                                    <FaExclamationTriangle className="mr-1.5 h-4 w-4" />
                                    Unmute
                                </>
                            ) : (
                                <>
                                    <FaExclamationTriangle className="mr-1.5 h-4 w-4" />
                                    Mute
                                </>
                            )}
                        </button>
                    </div>

                    <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                        <FaClipboard className="mr-1.5 h-4 w-4" />
                        Copy Error ID
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
