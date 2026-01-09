import { Application } from '@/types';
import { motion } from 'framer-motion';
import React from 'react';
import {
    FaArrowDown,
    FaArrowUp,
    FaBell,
    FaChartLine,
    FaCheckCircle,
    FaCodeBranch,
    FaDesktop,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaHistory,
    FaMobile,
    FaServer,
    FaUserShield,
} from 'react-icons/fa';

// Placeholder for charts - in a real implementation, you would use a charting library
const ChartPlaceholder = ({ height = 200, color = 'blue' }: { height?: number; color?: string }) => (
    <div className="bg-opacity-20 w-full rounded-lg" style={{ height, background: `linear-gradient(180deg, ${color}10 0%, ${color}30 100%)` }}>
        <div className="flex h-full items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">Chart Placeholder</span>
        </div>
    </div>
);

interface ErrorStats {
    total: number;
    resolved: number;
    unresolved: number;
    critical: number;
    today: number;
    yesterday: number;
    this_week: number;
    last_week: number;
    by_environment: {
        [key: string]: number;
    };
    by_browser: {
        [key: string]: number;
    };
    by_os: {
        [key: string]: number;
    };
}

interface PerformanceData {
    response_time: {
        current: number;
        previous: number;
        change_percentage: number;
        trend: number[];
    };
    throughput: {
        current: number;
        previous: number;
        change_percentage: number;
        trend: number[];
    };
    error_rate: {
        current: number;
        previous: number;
        change_percentage: number;
        trend: number[];
    };
    apdex?: {
        current: number;
        previous: number;
        change_percentage: number;
    };
    cpu_usage?: {
        current: number;
        previous: number;
        change_percentage: number;
    };
    memory_usage?: {
        current: number;
        previous: number;
        change_percentage: number;
    };
    endpoints?: {
        path: string;
        method: string;
        avg_response_time: number;
        p95_response_time: number;
        error_rate: number;
        throughput: number;
    }[];
}

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

interface Release {
    id: string;
    version: string;
    description: string;
    created_at: string;
    author: string;
    commit_hash: string;
    status: 'deployed' | 'pending' | 'failed';
    environment: string;
    changes: {
        type: 'feature' | 'bugfix' | 'improvement' | 'other';
        description: string;
    }[];
    error_count: number;
}

interface Alert {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'resolved' | 'snoozed';
    severity: 'info' | 'warning' | 'error' | 'critical';
    created_at: string;
    resolved_at?: string;
    metric: string;
    condition: string;
    threshold: number;
    current_value: number;
    triggered_count: number;
}

interface OverviewTabProps {
    application: Application;
    errorStats: ErrorStats;
    performanceData: PerformanceData;
    recentErrors: RecentError[];
    releases: Release[];
    alerts: Alert[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ application, errorStats, performanceData, recentErrors, releases, alerts }) => {
    // Get the most recent release
    const latestRelease = releases.length > 0 ? releases[0] : null;

    // Get active alerts
    const activeAlerts = alerts.filter((alert) => alert.status === 'active');

    // Get critical errors
    const criticalErrors = recentErrors.filter((error) => error.priority === 'critical' || error.status === 'unresolved');

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                    <div className="p-6">
                        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                            <FaChartLine className="mr-2 text-blue-500" />
                            Performance Overview
                        </h3>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Response Time</div>
                                <div className="mt-1 flex items-baseline">
                                    <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {performanceData.response_time.current}ms
                                    </span>
                                    <span
                                        className={`ml-2 text-sm ${performanceData.response_time.change_percentage < 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}
                                    >
                                        {performanceData.response_time.change_percentage < 0 ? (
                                            <FaArrowDown className="mr-1" />
                                        ) : (
                                            <FaArrowUp className="mr-1" />
                                        )}
                                        {Math.abs(performanceData.response_time.change_percentage)}%
                                    </span>
                                </div>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Throughput</div>
                                <div className="mt-1 flex items-baseline">
                                    <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {performanceData.throughput.current}/min
                                    </span>
                                    <span
                                        className={`ml-2 text-sm ${performanceData.throughput.change_percentage > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}
                                    >
                                        {performanceData.throughput.change_percentage > 0 ? (
                                            <FaArrowUp className="mr-1" />
                                        ) : (
                                            <FaArrowDown className="mr-1" />
                                        )}
                                        {Math.abs(performanceData.throughput.change_percentage)}%
                                    </span>
                                </div>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Error Rate</div>
                                <div className="mt-1 flex items-baseline">
                                    <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {performanceData.error_rate.current}%
                                    </span>
                                    <span
                                        className={`ml-2 text-sm ${performanceData.error_rate.change_percentage < 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}
                                    >
                                        {performanceData.error_rate.change_percentage < 0 ? (
                                            <FaArrowDown className="mr-1" />
                                        ) : (
                                            <FaArrowUp className="mr-1" />
                                        )}
                                        {Math.abs(performanceData.error_rate.change_percentage)}%
                                    </span>
                                </div>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                                <div className="text-sm text-gray-500 dark:text-gray-400">Apdex Score</div>
                                <div className="mt-1 flex items-baseline">
                                    <span className="text-2xl font-semibold text-gray-900 dark:text-white">{performanceData.apdex?.current}</span>
                                    <span
                                        className={`ml-2 text-sm ${performanceData.apdex?.change_percentage && performanceData.apdex.change_percentage > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}
                                    >
                                        {performanceData.apdex?.change_percentage && performanceData.apdex.change_percentage > 0 ? (
                                            <FaArrowUp className="mr-1" />
                                        ) : (
                                            <FaArrowDown className="mr-1" />
                                        )}
                                        {performanceData.apdex?.change_percentage ? Math.abs(performanceData.apdex.change_percentage) : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                    <div className="p-6">
                        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                            <FaExclamationTriangle className="mr-2 text-yellow-500" />
                            Error Breakdown
                        </h3>
                        <div className="mt-4 space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">By Environment</h4>
                                <div className="mt-2 space-y-2">
                                    {Object.entries(errorStats.by_environment).map(([env, count]) => (
                                        <div key={env} className="flex items-center">
                                            <span className="w-24 text-sm text-gray-700 dark:text-gray-300">{env}</span>
                                            <div className="ml-2 flex-1">
                                                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                                    <div
                                                        className="h-2 rounded-full bg-blue-500"
                                                        style={{ width: `${Math.min(100, (count / errorStats.total) * 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">By Status</h4>
                                <div className="mt-2 flex space-x-4">
                                    <div className="flex-1 rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Unresolved</div>
                                        <div className="mt-1 text-xl font-semibold text-red-500">{errorStats.unresolved}</div>
                                    </div>
                                    <div className="flex-1 rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Resolved</div>
                                        <div className="mt-1 text-xl font-semibold text-green-500">{errorStats.resolved}</div>
                                    </div>
                                    <div className="flex-1 rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Critical</div>
                                        <div className="mt-1 text-xl font-semibold text-yellow-500">{errorStats.critical}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                    <div className="p-6">
                        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                            <FaHistory className="mr-2 text-purple-500" />
                            Recent Activity
                        </h3>
                        <div className="mt-4 space-y-4">
                            {latestRelease && (
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 rounded-full bg-green-100 p-1 dark:bg-green-900/30">
                                        <FaCodeBranch className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Latest Release: {latestRelease.version}</p>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{latestRelease.description}</p>
                                    </div>
                                </div>
                            )}

                            {activeAlerts.length > 0 && (
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 rounded-full bg-red-100 p-1 dark:bg-red-900/30">
                                        <FaBell className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {activeAlerts.length} active alert{activeAlerts.length > 1 ? 's' : ''}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {activeAlerts[0].name}: {activeAlerts[0].description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {criticalErrors.length > 0 && (
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 rounded-full bg-yellow-100 p-1 dark:bg-yellow-900/30">
                                        <FaExclamationTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {criticalErrors.length} critical error{criticalErrors.length > 1 ? 's' : ''}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Latest: {criticalErrors[0].message}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start">
                                <div className="flex-shrink-0 rounded-full bg-blue-100 p-1 dark:bg-blue-900/30">
                                    <FaUserShield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Security scan completed</p>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">No vulnerabilities detected in the latest scan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Error Trends */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Error Trends</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Error occurrences over the last 30 days</p>

                    <div className="mt-4">
                        <ChartPlaceholder height={250} color="red" />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Today</div>
                            <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{errorStats.today}</div>
                            <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                {errorStats.today > errorStats.yesterday ? (
                                    <span className="flex items-center text-red-500">
                                        <FaArrowUp className="mr-1" />{' '}
                                        {Math.round(((errorStats.today - errorStats.yesterday) / errorStats.yesterday) * 100)}% from yesterday
                                    </span>
                                ) : (
                                    <span className="flex items-center text-green-500">
                                        <FaArrowDown className="mr-1" />{' '}
                                        {Math.round(((errorStats.yesterday - errorStats.today) / errorStats.yesterday) * 100)}% from yesterday
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                            <div className="text-sm text-gray-500 dark:text-gray-400">This Week</div>
                            <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{errorStats.this_week}</div>
                            <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                {errorStats.this_week > errorStats.last_week ? (
                                    <span className="flex items-center text-red-500">
                                        <FaArrowUp className="mr-1" />{' '}
                                        {Math.round(((errorStats.this_week - errorStats.last_week) / errorStats.last_week) * 100)}% from last week
                                    </span>
                                ) : (
                                    <span className="flex items-center text-green-500">
                                        <FaArrowDown className="mr-1" />{' '}
                                        {Math.round(((errorStats.last_week - errorStats.this_week) / errorStats.last_week) * 100)}% from last week
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Resolution Time</div>
                            <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">3.2h</div>
                            <div className="mt-1 flex items-center text-xs text-green-500 dark:text-green-400">
                                <FaArrowDown className="mr-1" /> 15% from last month
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                            <div className="text-sm text-gray-500 dark:text-gray-400">User Impact</div>
                            <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">142</div>
                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">users affected by errors</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Recent Errors and Performance Metrics */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Errors</h3>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                View all
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">
                            {recentErrors.slice(0, 4).map((error) => (
                                <div
                                    key={error.id}
                                    className="rounded-lg border border-gray-200 p-3 transition-colors duration-150 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            {error.status === 'resolved' ? (
                                                <FaCheckCircle className="h-5 w-5 text-green-500" />
                                            ) : error.priority === 'critical' ? (
                                                <FaExclamationCircle className="h-5 w-5 text-red-500" />
                                            ) : (
                                                <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />
                                            )}
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{error.type}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(error.last_seen).toLocaleString()}
                                                </p>
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{error.message}</p>
                                            <div className="mt-2 flex items-center text-xs">
                                                <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                    {error.environment}
                                                </span>
                                                <span className="ml-2 text-gray-500 dark:text-gray-400">{error.count} occurrences</span>
                                                {error.user_count && (
                                                    <span className="ml-2 text-gray-500 dark:text-gray-400">{error.user_count} users affected</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                View details
                            </button>
                        </div>

                        <div className="mt-4">
                            <ChartPlaceholder height={180} color="blue" />
                        </div>

                        <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Top Endpoints</h4>
                            <div className="mt-2 space-y-2">
                                {performanceData.endpoints?.slice(0, 3).map((endpoint, index) => (
                                    <div key={index} className="flex items-center rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                            {endpoint.method === 'GET' ? (
                                                <FaServer className="h-4 w-4" />
                                            ) : endpoint.method === 'POST' ? (
                                                <FaDesktop className="h-4 w-4" />
                                            ) : (
                                                <FaMobile className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {endpoint.method} {endpoint.path}
                                                </p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{endpoint.avg_response_time}ms</p>
                                            </div>
                                            <div className="mt-1 flex items-center justify-between text-xs">
                                                <span className="text-gray-500 dark:text-gray-400">{endpoint.throughput} req/min</span>
                                                <span className={endpoint.error_rate > 1 ? 'text-red-500' : 'text-green-500'}>
                                                    {endpoint.error_rate}% errors
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
