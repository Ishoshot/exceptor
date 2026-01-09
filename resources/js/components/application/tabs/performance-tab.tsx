import { motion } from 'framer-motion';
import React from 'react';
import { FaChartLine, FaClock, FaExchangeAlt, FaServer } from 'react-icons/fa';

// Interface for performance data
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
    apdex: {
        current: number;
        previous: number;
        change_percentage: number;
    };
    cpu_usage: {
        current: number;
        previous: number;
        change_percentage: number;
    };
    memory_usage: {
        current: number;
        previous: number;
        change_percentage: number;
    };
    endpoints: {
        path: string;
        method: string;
        avg_response_time: number;
        p95_response_time: number;
        error_rate: number;
        throughput: number;
    }[];
}

interface PerformanceTabProps {
    performanceData: PerformanceData;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({ performanceData }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Performance Monitoring</h2>
                <div className="flex space-x-2">
                    <select className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700">
                        <option>Last 24 Hours</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                    </select>
                    <button className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">Refresh</button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response Time</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{performanceData.response_time.current}ms</p>
                        </div>
                        <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                            <FaClock className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className={`text-${performanceData.response_time.change_percentage > 0 ? 'red' : 'green'}-500 text-sm`}>
                            {performanceData.response_time.change_percentage > 0 ? '↑' : '↓'}{' '}
                            {Math.abs(performanceData.response_time.change_percentage)}% from last week
                        </span>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Throughput</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{performanceData.throughput.current}/min</p>
                        </div>
                        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                            <FaExchangeAlt className="h-6 w-6 text-green-500" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className={`text-${performanceData.throughput.change_percentage > 0 ? 'green' : 'red'}-500 text-sm`}>
                            {performanceData.throughput.change_percentage > 0 ? '↑' : '↓'} {Math.abs(performanceData.throughput.change_percentage)}%
                            from last week
                        </span>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">CPU Usage</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{performanceData.cpu_usage.current}%</p>
                        </div>
                        <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                            <FaServer className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className={`text-${performanceData.cpu_usage.change_percentage > 0 ? 'red' : 'green'}-500 text-sm`}>
                            {performanceData.cpu_usage.change_percentage > 0 ? '↑' : '↓'} {Math.abs(performanceData.cpu_usage.change_percentage)}%
                            from last week
                        </span>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Memory Usage</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{performanceData.memory_usage.current}GB</p>
                        </div>
                        <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/30">
                            <FaChartLine className="h-6 w-6 text-orange-500" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className={`text-${performanceData.memory_usage.change_percentage > 0 ? 'red' : 'green'}-500 text-sm`}>
                            {performanceData.memory_usage.change_percentage > 0 ? '↑' : '↓'}{' '}
                            {Math.abs(performanceData.memory_usage.change_percentage)}% from last week
                        </span>
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Performance Metrics</h3>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">Performance chart visualization would appear here</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Slowest Endpoints</h3>
                    <div className="space-y-3">
                        {performanceData.endpoints.map((endpoint, i) => (
                            <div key={i} className="flex items-center justify-between rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">{endpoint.path}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{endpoint.method}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-800 dark:text-white">{endpoint.avg_response_time}ms</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{endpoint.throughput} calls/min</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Database Performance</h3>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">Query {i}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">SELECT * FROM users</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-800 dark:text-white">{120 - i * 15}ms</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{200 - i * 30} executions</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
