import React from 'react';
import { FaBell, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaFilter, FaTimesCircle } from 'react-icons/fa';

export interface AlertFilterProps {
    onFilterChange: (filters: AlertFilters) => void;
    filters: AlertFilters;
    onClearFilters: () => void;
}

export interface AlertFilters {
    status: string[];
    type: string[];
    timeRange: string;
}

export const AlertFilter: React.FC<AlertFilterProps> = ({ onFilterChange, filters, onClearFilters }) => {
    // Handle status filter change
    const handleStatusChange = (status: string) => {
        const newStatus = [...filters.status];

        if (newStatus.includes(status)) {
            // Remove status if already selected
            const index = newStatus.indexOf(status);
            newStatus.splice(index, 1);
        } else {
            // Add status if not selected
            newStatus.push(status);
        }

        onFilterChange({
            ...filters,
            status: newStatus,
        });
    };

    // Handle type filter change
    const handleTypeChange = (type: string) => {
        const newType = [...filters.type];

        if (newType.includes(type)) {
            // Remove type if already selected
            const index = newType.indexOf(type);
            newType.splice(index, 1);
        } else {
            // Add type if not selected
            newType.push(type);
        }

        onFilterChange({
            ...filters,
            type: newType,
        });
    };

    // Handle time range change
    const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({
            ...filters,
            timeRange: e.target.value,
        });
    };

    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <div className="mb-4 flex items-center">
                <FaFilter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <h3 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Filter Alerts</h3>
            </div>

            <div className="space-y-5">
                {/* Status filter */}
                <div>
                    <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Status</h4>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                id="status-active"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.status.includes('active')}
                                onChange={() => handleStatusChange('active')}
                            />
                            <label htmlFor="status-active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaCheckCircle className="mr-1 h-4 w-4 text-green-500" />
                                    Active
                                </span>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="status-paused"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.status.includes('paused')}
                                onChange={() => handleStatusChange('paused')}
                            />
                            <label htmlFor="status-paused" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaTimesCircle className="mr-1 h-4 w-4 text-gray-500" />
                                    Paused
                                </span>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="status-triggered"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.status.includes('triggered')}
                                onChange={() => handleStatusChange('triggered')}
                            />
                            <label htmlFor="status-triggered" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaExclamationCircle className="mr-1 h-4 w-4 text-red-500" />
                                    Triggered
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Type filter */}
                <div>
                    <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Alert Type</h4>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                id="type-error"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.type.includes('error_threshold')}
                                onChange={() => handleTypeChange('error_threshold')}
                            />
                            <label htmlFor="type-error" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaExclamationTriangle className="mr-1 h-4 w-4 text-red-500" />
                                    Error Threshold
                                </span>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="type-performance"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.type.includes('performance_degradation')}
                                onChange={() => handleTypeChange('performance_degradation')}
                            />
                            <label htmlFor="type-performance" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaExclamationCircle className="mr-1 h-4 w-4 text-yellow-500" />
                                    Performance
                                </span>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="type-uptime"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.type.includes('uptime')}
                                onChange={() => handleTypeChange('uptime')}
                            />
                            <label htmlFor="type-uptime" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaExclamationCircle className="mr-1 h-4 w-4 text-blue-500" />
                                    Uptime
                                </span>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="type-custom"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.type.includes('custom')}
                                onChange={() => handleTypeChange('custom')}
                            />
                            <label htmlFor="type-custom" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaBell className="mr-1 h-4 w-4 text-purple-500" />
                                    Custom
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Time range filter */}
                <div>
                    <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Time Range</h4>
                    <div className="relative">
                        <select
                            id="time-range"
                            className="block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            value={filters.timeRange}
                            onChange={handleTimeRangeChange}
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="quarter">Last 90 Days</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Clear filters button */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};
