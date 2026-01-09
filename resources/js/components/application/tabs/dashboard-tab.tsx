import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
    FaArrowDown,
    FaArrowUp,
    FaCalendarAlt,
    FaChartLine,
    FaCheckCircle,
    FaClock,
    FaDatabase,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaMemory,
    FaMicrochip,
    FaServer,
} from 'react-icons/fa';

export const DashboardTab: React.FC = () => {
    const [timeRange, setTimeRange] = useState('24h');

    // Mock data for dashboard
    const stats = {
        errors: {
            count: 24,
            trend: -15, // percentage change
            critical: 3,
            warning: 8,
            info: 13,
        },
        performance: {
            avgResponseTime: 235, // ms
            trend: 5, // percentage change
            p95ResponseTime: 450, // ms
            p99ResponseTime: 780, // ms
        },
        uptime: {
            percentage: 99.95,
            trend: 0.03, // percentage change
            lastOutage: '2023-03-15T08:23:45Z',
            outageCount: 1,
        },
        resources: {
            cpuUsage: 42, // percentage
            memoryUsage: 68, // percentage
            diskUsage: 57, // percentage
            networkUsage: 35, // percentage
        },
    };

    const recentErrors = [
        {
            id: 'err-001',
            message: 'Uncaught TypeError: Cannot read property "length" of undefined',
            timestamp: '2023-03-23T14:32:15Z',
            count: 12,
            status: 'critical',
        },
        {
            id: 'err-002',
            message: 'Failed to connect to Redis server',
            timestamp: '2023-03-23T13:45:22Z',
            count: 5,
            status: 'critical',
        },
        {
            id: 'err-003',
            message: 'API rate limit exceeded for endpoint /api/users',
            timestamp: '2023-03-23T12:18:09Z',
            count: 8,
            status: 'warning',
        },
        {
            id: 'err-004',
            message: 'Slow database query detected (query took 3.2s)',
            timestamp: '2023-03-23T11:05:33Z',
            count: 3,
            status: 'warning',
        },
    ];

    const healthChecks = [
        { name: 'API Server', status: 'healthy', latency: 45 },
        { name: 'Database', status: 'healthy', latency: 12 },
        { name: 'Redis Cache', status: 'healthy', latency: 5 },
        { name: 'Background Workers', status: 'degraded', latency: 230 },
        { name: 'Storage Service', status: 'healthy', latency: 85 },
    ];

    // Format timestamp
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Format time ago
    const timeAgo = (timestamp: string) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    // Get trend icon and color
    const getTrendIndicator = (trend: number) => {
        if (trend > 0) {
            return {
                icon: <FaArrowUp className="h-3 w-3" />,
                color: 'text-red-500',
                bgColor: 'bg-red-100 dark:bg-red-900/30',
            };
        } else if (trend < 0) {
            return {
                icon: <FaArrowDown className="h-3 w-3" />,
                color: 'text-green-500',
                bgColor: 'bg-green-100 dark:bg-green-900/30',
            };
        } else {
            return {
                icon: null,
                color: 'text-gray-500',
                bgColor: 'bg-gray-100 dark:bg-gray-700',
            };
        }
    };

    // Get status indicator
    const getStatusIndicator = (status: string) => {
        switch (status) {
            case 'healthy':
                return {
                    icon: <FaCheckCircle className="h-4 w-4 text-green-500" />,
                    text: 'Healthy',
                    color: 'text-green-500',
                };
            case 'degraded':
                return {
                    icon: <FaExclamationCircle className="h-4 w-4 text-yellow-500" />,
                    text: 'Degraded',
                    color: 'text-yellow-500',
                };
            case 'critical':
                return {
                    icon: <FaExclamationTriangle className="h-4 w-4 text-red-500" />,
                    text: 'Critical',
                    color: 'text-red-500',
                };
            case 'warning':
                return {
                    icon: <FaExclamationCircle className="h-4 w-4 text-yellow-500" />,
                    text: 'Warning',
                    color: 'text-yellow-500',
                };
            default:
                return {
                    icon: <FaCheckCircle className="h-4 w-4 text-gray-500" />,
                    text: 'Unknown',
                    color: 'text-gray-500',
                };
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Application Dashboard</h2>

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
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Errors card */}
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="mr-3 rounded-md bg-red-100 p-2 dark:bg-red-900/30">
                                <FaExclamationTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Errors</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.errors.count}</p>
                            </div>
                        </div>
                        <div
                            className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${getTrendIndicator(stats.errors.trend).bgColor} ${getTrendIndicator(stats.errors.trend).color}`}
                        >
                            {getTrendIndicator(stats.errors.trend).icon}
                            <span className="ml-1">{Math.abs(stats.errors.trend)}%</span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div>
                            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500"></span>
                            Critical: {stats.errors.critical}
                        </div>
                        <div>
                            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-yellow-500"></span>
                            Warning: {stats.errors.warning}
                        </div>
                        <div>
                            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                            Info: {stats.errors.info}
                        </div>
                    </div>
                </div>

                {/* Performance card */}
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="mr-3 rounded-md bg-blue-100 p-2 dark:bg-blue-900/30">
                                <FaChartLine className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Response</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.performance.avgResponseTime} ms</p>
                            </div>
                        </div>
                        <div
                            className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${getTrendIndicator(-stats.performance.trend).bgColor} ${getTrendIndicator(-stats.performance.trend).color}`}
                        >
                            {getTrendIndicator(-stats.performance.trend).icon}
                            <span className="ml-1">{Math.abs(stats.performance.trend)}%</span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div>p95: {stats.performance.p95ResponseTime} ms</div>
                        <div>p99: {stats.performance.p99ResponseTime} ms</div>
                    </div>
                </div>

                {/* Uptime card */}
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="mr-3 rounded-md bg-green-100 p-2 dark:bg-green-900/30">
                                <FaServer className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.uptime.percentage}%</p>
                            </div>
                        </div>
                        <div
                            className={`flex items-center rounded-full px-2 py-1 text-xs font-medium ${getTrendIndicator(stats.uptime.trend).bgColor} ${getTrendIndicator(stats.uptime.trend).color}`}
                        >
                            {getTrendIndicator(stats.uptime.trend).icon}
                            <span className="ml-1">{Math.abs(stats.uptime.trend)}%</span>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                        <div>Last outage: {new Date(stats.uptime.lastOutage).toLocaleDateString()}</div>
                    </div>
                </div>

                {/* Resource usage card */}
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="flex items-center">
                        <div className="mr-3 rounded-md bg-purple-100 p-2 dark:bg-purple-900/30">
                            <FaMemory className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resource Usage</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div>
                            <div className="mb-1 flex justify-between text-xs text-gray-700 dark:text-gray-300">
                                <div className="flex items-center">
                                    <FaMicrochip className="mr-1.5 h-4 w-4 flex-shrink-0 text-blue-500" />
                                    <span>CPU</span>
                                </div>
                                <span>{stats.resources.cpuUsage}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${stats.resources.cpuUsage}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="mb-1 flex justify-between text-xs text-gray-700 dark:text-gray-300">
                                <div className="flex items-center">
                                    <FaMemory className="mr-1 h-3 w-3 text-purple-500" />
                                    <span>Memory</span>
                                </div>
                                <span>{stats.resources.memoryUsage}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${stats.resources.memoryUsage}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="mb-1 flex justify-between text-xs text-gray-700 dark:text-gray-300">
                                <div className="flex items-center">
                                    <FaDatabase className="mr-1 h-3 w-3 text-green-500" />
                                    <span>Disk</span>
                                </div>
                                <span>{stats.resources.diskUsage}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${stats.resources.diskUsage}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent errors */}
                <div className="rounded-lg bg-white shadow lg:col-span-2 dark:bg-gray-800">
                    <div className="border-b border-gray-200 px-4 py-5 sm:px-6 dark:border-gray-700">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Errors</h3>
                    </div>
                    <div className="overflow-hidden">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentErrors.map((error) => (
                                <li key={error.id} className="cursor-pointer px-4 py-4 hover:bg-gray-50 sm:px-6 dark:hover:bg-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {getStatusIndicator(error.status).icon}
                                            <p className="ml-2 max-w-md truncate text-sm font-medium text-gray-900 dark:text-white">
                                                {error.message}
                                            </p>
                                        </div>
                                        <div className="ml-2 flex flex-shrink-0">
                                            <p className="inline-flex rounded-full bg-gray-100 px-2 text-xs leading-5 font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                {error.count} occurrences
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-between">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <FaClock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                            <p>
                                                {formatTimestamp(error.timestamp)} ({timeAgo(error.timestamp)})
                                            </p>
                                        </div>
                                        <div>
                                            <a
                                                href="#"
                                                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                View details
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {recentErrors.length === 0 && (
                            <div className="px-4 py-8 text-center">
                                <FaCheckCircle className="mx-auto h-12 w-12 text-green-500" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No errors</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your application is running smoothly.</p>
                            </div>
                        )}

                        <div className="border-t border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700">
                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                View all errors →
                            </a>
                        </div>
                    </div>
                </div>

                {/* Health checks */}
                <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="border-b border-gray-200 px-4 py-5 sm:px-6 dark:border-gray-700">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">System Health</h3>
                    </div>
                    <div className="overflow-hidden">
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {healthChecks.map((check, index) => (
                                <li key={index} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {getStatusIndicator(check.status).icon}
                                            <p className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{check.name}</p>
                                        </div>
                                        <div className="ml-2 flex flex-shrink-0">
                                            <p className={`text-sm ${getStatusIndicator(check.status).color}`}>
                                                {getStatusIndicator(check.status).text}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <FaClock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                            <p>Latency: {check.latency} ms</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700">
                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                View health details →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
