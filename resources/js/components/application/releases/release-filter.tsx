import React from 'react';
import { FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaFilter, FaServer, FaTimesCircle, FaUser } from 'react-icons/fa';

export interface ReleaseFilterProps {
    onFilterChange: (filters: ReleaseFilters) => void;
    filters: ReleaseFilters;
    onClearFilters: () => void;
}

export interface ReleaseFilters {
    status: string[];
    environment: string[];
    timeRange: string;
    author: string;
}

export const ReleaseFilter: React.FC<ReleaseFilterProps> = ({ onFilterChange, filters, onClearFilters }) => {
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

    // Handle environment filter change
    const handleEnvironmentChange = (environment: string) => {
        const newEnvironment = [...filters.environment];

        if (newEnvironment.includes(environment)) {
            // Remove environment if already selected
            const index = newEnvironment.indexOf(environment);
            newEnvironment.splice(index, 1);
        } else {
            // Add environment if not selected
            newEnvironment.push(environment);
        }

        onFilterChange({
            ...filters,
            environment: newEnvironment,
        });
    };

    // Handle time range change
    const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({
            ...filters,
            timeRange: e.target.value,
        });
    };

    // Handle author change
    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({
            ...filters,
            author: e.target.value,
        });
    };

    return (
        <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            <div className="mb-4 flex items-center">
                <FaFilter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <h3 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Filter Releases</h3>
            </div>

            <div className="space-y-5">
                {/* Status filter */}
                <div>
                    <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Status</h4>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                id="status-deployed"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.status.includes('deployed')}
                                onChange={() => handleStatusChange('deployed')}
                            />
                            <label htmlFor="status-deployed" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaCheckCircle className="mr-1 h-4 w-4 text-green-500" />
                                    Deployed
                                </span>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="status-pending"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.status.includes('pending')}
                                onChange={() => handleStatusChange('pending')}
                            />
                            <label htmlFor="status-pending" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaExclamationCircle className="mr-1 h-4 w-4 text-yellow-500" />
                                    Pending
                                </span>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="status-failed"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.status.includes('failed')}
                                onChange={() => handleStatusChange('failed')}
                            />
                            <label htmlFor="status-failed" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaTimesCircle className="mr-1 h-4 w-4 text-red-500" />
                                    Failed
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Environment filter */}
                <div>
                    <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Environment</h4>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                id="env-production"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.environment.includes('production')}
                                onChange={() => handleEnvironmentChange('production')}
                            />
                            <label htmlFor="env-production" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaServer className="mr-1 h-4 w-4 text-purple-500" />
                                    Production
                                </span>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="env-staging"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.environment.includes('staging')}
                                onChange={() => handleEnvironmentChange('staging')}
                            />
                            <label htmlFor="env-staging" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaServer className="mr-1 h-4 w-4 text-blue-500" />
                                    Staging
                                </span>
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="env-development"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                checked={filters.environment.includes('development')}
                                onChange={() => handleEnvironmentChange('development')}
                            />
                            <label htmlFor="env-development" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                <span className="flex items-center">
                                    <FaServer className="mr-1 h-4 w-4 text-gray-500" />
                                    Development
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

                {/* Author filter */}
                <div>
                    <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Author</h4>
                    <div className="relative">
                        <input
                            type="text"
                            id="author"
                            className="block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            placeholder="Filter by author"
                            value={filters.author}
                            onChange={handleAuthorChange}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <FaUser className="h-4 w-4 text-gray-400" />
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
