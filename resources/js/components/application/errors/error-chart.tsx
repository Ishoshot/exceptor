import React, { useState } from 'react';
import { FaCalendarAlt, FaChartBar, FaChartLine, FaChartPie } from 'react-icons/fa';

// Placeholder for charts - in a real implementation, you would use a charting library like recharts
const ChartPlaceholder = ({ height = 200, color = 'blue' }: { height?: number; color?: string }) => (
    <div
        className={`w-full overflow-hidden rounded-lg bg-gradient-to-r from-${color}-100 to-${color}-50 dark:from-${color}-900/30 dark:to-${color}-800/10`}
        style={{ height: `${height}px` }}
    >
        <div className="flex h-full w-full items-center justify-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Chart visualization would appear here</span>
        </div>
    </div>
);

export const ErrorChart: React.FC = () => {
    type TimeRangeType = '24h' | '7d' | '30d' | '90d';
    const [timeRange, setTimeRange] = useState<TimeRangeType>('7d');
    const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
    const [groupBy, setGroupBy] = useState<'hour' | 'day' | 'week' | 'month'>('day');

    // Get time range options
    const timeRangeOptions = [
        { value: '24h', label: 'Last 24 Hours' },
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: '90d', label: 'Last 90 Days' },
    ];

    // Get chart type options
    const chartTypeOptions = [
        { value: 'line', label: 'Line', icon: <FaChartLine className="h-4 w-4" /> },
        { value: 'bar', label: 'Bar', icon: <FaChartBar className="h-4 w-4" /> },
        { value: 'pie', label: 'Distribution', icon: <FaChartPie className="h-4 w-4" /> },
    ];

    // Get group by options
    const groupByOptions = [
        { value: 'hour', label: 'Hour' },
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
    ];

    // Get chart color based on chart type
    const getChartColor = () => {
        switch (chartType) {
            case 'line':
                return 'blue';
            case 'bar':
                return 'purple';
            case 'pie':
                return 'green';
            default:
                return 'blue';
        }
    };

    return (
        <div className="mt-4">
            <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex items-center space-x-2">
                    <div className="relative inline-block">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRangeType)}
                            className="block w-full rounded-md border-gray-300 bg-white py-2 pr-10 pl-3 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            {timeRangeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                            <FaCalendarAlt className="h-4 w-4" />
                        </div>
                    </div>

                    {timeRange !== '24h' && (
                        <div className="relative inline-block">
                            <select
                                value={groupBy}
                                onChange={(e) => setGroupBy(e.target.value as any)}
                                className="block w-full rounded-md border-gray-300 bg-white py-2 pr-10 pl-3 text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                {groupByOptions
                                    .filter((option) => {
                                        // Filter out options that don't make sense for the current time range
                                        if (timeRange === '7d' && option.value === 'month') return false;
                                        // Only show hourly grouping for 24h view
                                        if (timeRange === ('24h' as TimeRangeType) && option.value !== 'hour') return false;
                                        return true;
                                    })
                                    .map((option) => (
                                        <option key={option.value} value={option.value}>
                                            Group by {option.label}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
                    {chartTypeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setChartType(option.value as any)}
                            className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                                chartType === option.value
                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                            }`}
                            title={option.label}
                        >
                            {option.icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <ChartPlaceholder height={250} color={getChartColor()} />

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Unresolved</span>
                </div>
                <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Critical</span>
                </div>
                <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Resolved</span>
                </div>
                <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-gray-400"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Muted</span>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/10">
                    <div className="text-sm text-red-800 dark:text-red-300">Unresolved</div>
                    <div className="mt-1 text-xl font-semibold text-red-900 dark:text-red-200">24</div>
                    <div className="mt-1 text-xs text-red-700 dark:text-red-400">+5 from previous period</div>
                </div>

                <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/10">
                    <div className="text-sm text-yellow-800 dark:text-yellow-300">Critical</div>
                    <div className="mt-1 text-xl font-semibold text-yellow-900 dark:text-yellow-200">3</div>
                    <div className="mt-1 text-xs text-yellow-700 dark:text-yellow-400">-1 from previous period</div>
                </div>

                <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/10">
                    <div className="text-sm text-green-800 dark:text-green-300">Resolved</div>
                    <div className="mt-1 text-xl font-semibold text-green-900 dark:text-green-200">42</div>
                    <div className="mt-1 text-xs text-green-700 dark:text-green-400">+12 from previous period</div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/30">
                    <div className="text-sm text-gray-800 dark:text-gray-300">Muted</div>
                    <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-200">7</div>
                    <div className="mt-1 text-xs text-gray-700 dark:text-gray-400">No change</div>
                </div>
            </div>
        </div>
    );
};
