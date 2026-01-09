import { Application } from '@/types';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
    FaCalendarAlt,
    FaCode,
    FaDatabase,
    FaDownload,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaFilter,
    FaInfoCircle,
    FaNetworkWired,
    FaSearch,
    FaServer,
} from 'react-icons/fa';

interface LogsTabProps {
    application: Application;
}

export const LogsTab: React.FC<LogsTabProps> = ({ application }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLogLevels, setSelectedLogLevels] = useState<string[]>(['error', 'warning', 'info', 'debug']);
    const [selectedSources, setSelectedSources] = useState<string[]>(['app', 'server', 'database']);
    const [timeRange, setTimeRange] = useState('24h');
    const [sortBy, setSortBy] = useState('timestamp');
    const [sortDirection, setSortDirection] = useState('desc');

    // Mock log data
    const logs = [
        {
            id: '1',
            timestamp: '2023-03-23T14:32:15Z',
            level: 'error',
            source: 'app',
            message: 'Uncaught TypeError: Cannot read property "length" of undefined',
            context: { file: 'UserController.php', line: 156, trace: 'Stack trace information would be here...' },
        },
        {
            id: '2',
            timestamp: '2023-03-23T14:30:45Z',
            level: 'warning',
            source: 'database',
            message: 'Slow query detected (2.5s): SELECT * FROM users WHERE last_login > ?',
            context: { query: 'SELECT * FROM users WHERE last_login > ?', params: ['2023-01-01'] },
        },
        {
            id: '3',
            timestamp: '2023-03-23T14:28:12Z',
            level: 'info',
            source: 'app',
            message: 'User authenticated successfully',
            context: { user_id: 1045, ip: '192.168.1.1' },
        },
        {
            id: '4',
            timestamp: '2023-03-23T14:25:33Z',
            level: 'debug',
            source: 'server',
            message: 'Request processed in 125ms',
            context: { route: '/api/users', method: 'GET', status: 200 },
        },
        {
            id: '5',
            timestamp: '2023-03-23T14:20:18Z',
            level: 'error',
            source: 'server',
            message: 'Failed to connect to Redis server',
            context: { host: 'redis-cache.internal', port: 6379, error: 'Connection refused' },
        },
        {
            id: '6',
            timestamp: '2023-03-23T14:15:42Z',
            level: 'info',
            source: 'database',
            message: 'Database migration completed successfully',
            context: { version: '2.5.0', tables_affected: 12 },
        },
        {
            id: '7',
            timestamp: '2023-03-23T14:10:09Z',
            level: 'warning',
            source: 'app',
            message: 'Deprecated function call detected',
            context: { function: 'old_auth_check()', file: 'LegacyAuth.php', line: 78 },
        },
        {
            id: '8',
            timestamp: '2023-03-23T14:05:51Z',
            level: 'debug',
            source: 'server',
            message: 'Cache hit for key "user_preferences_1045"',
            context: { cache_key: 'user_preferences_1045', size: '2.3KB' },
        },
    ];

    // Filter logs based on search, log levels, sources
    const filteredLogs = logs.filter((log) => {
        const matchesSearch =
            searchQuery === '' ||
            log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            JSON.stringify(log.context).toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLevel = selectedLogLevels.includes(log.level);
        const matchesSource = selectedSources.includes(log.source);

        return matchesSearch && matchesLevel && matchesSource;
    });

    // Sort logs
    const sortedLogs = [...filteredLogs].sort((a, b) => {
        if (sortBy === 'timestamp') {
            return sortDirection === 'asc'
                ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }

        if (sortBy === 'level') {
            const levelOrder = { error: 0, warning: 1, info: 2, debug: 3 };
            return sortDirection === 'asc'
                ? levelOrder[a.level as keyof typeof levelOrder] - levelOrder[b.level as keyof typeof levelOrder]
                : levelOrder[b.level as keyof typeof levelOrder] - levelOrder[a.level as keyof typeof levelOrder];
        }

        return 0;
    });

    // Format timestamp
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    // Get icon for log level
    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'error':
                return <FaExclamationTriangle className="h-4 w-4 text-red-500" />;
            case 'warning':
                return <FaExclamationTriangle className="h-4 w-4 text-yellow-500" />;
            case 'info':
                return <FaInfoCircle className="h-4 w-4 text-blue-500" />;
            case 'debug':
                return <FaExclamationCircle className="h-4 w-4 text-gray-500" />;
            default:
                return <FaInfoCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    // Get icon for log source
    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'app':
                return <FaCode className="h-4 w-4 text-purple-500" />;
            case 'server':
                return <FaServer className="h-4 w-4 text-green-500" />;
            case 'database':
                return <FaDatabase className="h-4 w-4 text-blue-500" />;
            default:
                return <FaNetworkWired className="h-4 w-4 text-gray-500" />;
        }
    };

    // Get color for log level
    const getLevelColor = (level: string) => {
        switch (level) {
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'info':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'debug':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    // Toggle sort direction
    const toggleSort = (field: string) => {
        if (sortBy === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('desc');
        }
    };

    // Get sort icon
    const getSortIcon = (field: string) => {
        if (sortBy !== field) return <FaFilter className="h-4 w-4 text-gray-400" />;
        return sortDirection === 'asc' ? (
            <FaExclamationTriangle className="h-4 w-4 text-blue-500" />
        ) : (
            <FaExclamationTriangle className="h-4 w-4 text-blue-500" />
        );
    };

    // Toggle log level selection
    const toggleLogLevel = (level: string) => {
        if (selectedLogLevels.includes(level)) {
            setSelectedLogLevels(selectedLogLevels.filter((l) => l !== level));
        } else {
            setSelectedLogLevels([...selectedLogLevels, level]);
        }
    };

    // Toggle source selection
    const toggleSource = (source: string) => {
        if (selectedSources.includes(source)) {
            setSelectedSources(selectedSources.filter((s) => s !== source));
        } else {
            setSelectedSources([...selectedSources, source]);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 p-4">
            <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Application Logs</h2>

                <div className="flex flex-wrap gap-2">
                    <div className="relative">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                        >
                            <option value="1h">Last Hour</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>
                        <FaCalendarAlt className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    </div>

                    <button className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm leading-4 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
                        <FaDownload className="mr-2 -ml-0.5 h-4 w-4" /> Export Logs
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
                {/* Filters panel */}
                <div className="w-full rounded-lg bg-white p-4 shadow md:w-64 dark:bg-gray-800">
                    <h3 className="mb-3 flex items-center text-sm font-medium text-gray-900 dark:text-white">
                        <FaFilter className="mr-2 h-4 w-4 text-gray-500" /> Filters
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Log Levels</h4>
                            <div className="space-y-2">
                                {['error', 'warning', 'info', 'debug'].map((level) => (
                                    <div key={level} className="flex items-center">
                                        <input
                                            id={`level-${level}`}
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                            checked={selectedLogLevels.includes(level)}
                                            onChange={() => toggleLogLevel(level)}
                                        />
                                        <label htmlFor={`level-${level}`} className="ml-2 block text-sm text-gray-700 capitalize dark:text-gray-300">
                                            <span className="flex items-center">
                                                {getLevelIcon(level)}
                                                <span className="ml-1">{level}</span>
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Sources</h4>
                            <div className="space-y-2">
                                {['app', 'server', 'database'].map((source) => (
                                    <div key={source} className="flex items-center">
                                        <input
                                            id={`source-${source}`}
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                            checked={selectedSources.includes(source)}
                                            onChange={() => toggleSource(source)}
                                        />
                                        <label
                                            htmlFor={`source-${source}`}
                                            className="ml-2 block text-sm text-gray-700 capitalize dark:text-gray-300"
                                        >
                                            <span className="flex items-center">
                                                {getSourceIcon(source)}
                                                <span className="ml-1">{source}</span>
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logs panel */}
                <div className="flex-1">
                    <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                        {/* Search bar */}
                        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FaSearch className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Search logs..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Logs table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                            onClick={() => toggleSort('timestamp')}
                                        >
                                            <div className="flex items-center">Time {getSortIcon('timestamp')}</div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                            onClick={() => toggleSort('level')}
                                        >
                                            <div className="flex items-center">Level {getSortIcon('level')}</div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                        >
                                            Source
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                        >
                                            Message
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {sortedLogs.map((log) => (
                                        <tr key={log.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                {formatTimestamp(log.timestamp)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getLevelColor(log.level)}`}
                                                >
                                                    {getLevelIcon(log.level)}
                                                    <span className="ml-1 capitalize">{log.level}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center">
                                                    {getSourceIcon(log.source)}
                                                    <span className="ml-1 capitalize">{log.source}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                                <div className="max-w-md truncate">{log.message}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty state */}
                        {filteredLogs.length === 0 && (
                            <div className="px-6 py-10 text-center">
                                <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No logs found</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex flex-1 justify-between sm:hidden">
                                <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                    Previous
                                </button>
                                <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLogs.length}</span>{' '}
                                        of <span className="font-medium">{filteredLogs.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
                                            <span className="sr-only">Previous</span>
                                            <svg
                                                className="h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                        <button className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                                            1
                                        </button>
                                        <button className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
                                            <span className="sr-only">Next</span>
                                            <svg
                                                className="h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
