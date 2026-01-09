import { motion } from 'framer-motion';
import React from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

interface ErrorFilterPanelProps {
    statuses: string[];
    environments: string[];
    priorities: string[];
    selectedStatus: string[];
    selectedEnvironments: string[];
    selectedPriorities: string[];
    onStatusChange: (statuses: string[]) => void;
    onEnvironmentChange: (environments: string[]) => void;
    onPriorityChange: (priorities: string[]) => void;
    onClearFilters: () => void;
}

export const ErrorFilterPanel: React.FC<ErrorFilterPanelProps> = ({
    statuses,
    environments,
    priorities,
    selectedStatus,
    selectedEnvironments,
    selectedPriorities,
    onStatusChange,
    onEnvironmentChange,
    onPriorityChange,
    onClearFilters,
}) => {
    // Toggle status selection
    const toggleStatus = (status: string) => {
        if (selectedStatus.includes(status)) {
            onStatusChange(selectedStatus.filter((s) => s !== status));
        } else {
            onStatusChange([...selectedStatus, status]);
        }
    };

    // Toggle environment selection
    const toggleEnvironment = (environment: string) => {
        if (selectedEnvironments.includes(environment)) {
            onEnvironmentChange(selectedEnvironments.filter((e) => e !== environment));
        } else {
            onEnvironmentChange([...selectedEnvironments, environment]);
        }
    };

    // Toggle priority selection
    const togglePriority = (priority: string) => {
        if (selectedPriorities.includes(priority)) {
            onPriorityChange(selectedPriorities.filter((p) => p !== priority));
        } else {
            onPriorityChange([...selectedPriorities, priority]);
        }
    };

    // Clear all filters
    const clearAllFilters = () => {
        onStatusChange([]);
        onEnvironmentChange([]);
        onPriorityChange([]);
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'unresolved':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'muted':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        }
    };

    // Get priority color
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'high':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
            case 'critical':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-4 border-t border-gray-200 p-4 dark:border-gray-700"
        >
            <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                    <FaFilter className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    Filter Errors
                </h3>

                {(selectedStatus.length > 0 || selectedEnvironments.length > 0 || selectedPriorities.length > 0) && (
                    <button
                        onClick={clearAllFilters}
                        className="flex items-center text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <FaTimes className="mr-1 h-3 w-3" />
                        Clear all filters
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Status Filter */}
                <div>
                    <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Status</h4>
                    <div className="space-y-2">
                        {statuses.map((status) => (
                            <button
                                key={status}
                                onClick={() => toggleStatus(status)}
                                className={`mr-2 inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium ${
                                    selectedStatus.includes(status)
                                        ? getStatusColor(status)
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Environment Filter */}
                <div>
                    <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Environment</h4>
                    <div className="space-y-2">
                        {environments.map((environment) => (
                            <button
                                key={environment}
                                onClick={() => toggleEnvironment(environment)}
                                className={`mr-2 inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium ${
                                    selectedEnvironments.includes(environment)
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                            >
                                {environment}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Priority Filter */}
                <div>
                    <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Priority</h4>
                    <div className="space-y-2">
                        {priorities.map((priority) => (
                            <button
                                key={priority}
                                onClick={() => togglePriority(priority)}
                                className={`mr-2 inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium ${
                                    selectedPriorities.includes(priority)
                                        ? getPriorityColor(priority)
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                            >
                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Active Filters */}
            {(selectedStatus.length > 0 || selectedEnvironments.length > 0 || selectedPriorities.length > 0) && (
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Active Filters</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedStatus.map((status) => (
                            <div
                                key={`status-${status}`}
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(status)}`}
                            >
                                Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                                <button
                                    onClick={() => toggleStatus(status)}
                                    className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    <FaTimes className="h-2 w-2" />
                                </button>
                            </div>
                        ))}

                        {selectedEnvironments.map((environment) => (
                            <div
                                key={`env-${environment}`}
                                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            >
                                Environment: {environment}
                                <button
                                    onClick={() => toggleEnvironment(environment)}
                                    className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                                >
                                    <FaTimes className="h-2 w-2" />
                                </button>
                            </div>
                        ))}

                        {selectedPriorities.map((priority) => (
                            <div
                                key={`priority-${priority}`}
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityColor(priority)}`}
                            >
                                Priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                <button
                                    onClick={() => togglePriority(priority)}
                                    className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    <FaTimes className="h-2 w-2" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};
