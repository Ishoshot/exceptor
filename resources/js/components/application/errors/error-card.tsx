import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaChevronDown,
    FaChevronUp,
    FaCode,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaTag,
    FaUserCircle,
    FaUserFriends,
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

interface ErrorCardProps {
    error: RecentError;
    isSelected: boolean;
    onSelect: (error: RecentError) => void;
    onCheckboxChange: (errorId: string, checked: boolean) => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ error, isSelected, onSelect, onCheckboxChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Get status icon
    const getStatusIcon = () => {
        switch (error.status) {
            case 'resolved':
                return <FaCheckCircle className="h-5 w-5 text-green-500" />;
            case 'unresolved':
                return error.priority === 'critical' ? (
                    <FaExclamationCircle className="h-5 w-5 text-red-500" />
                ) : (
                    <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />
                );
            case 'muted':
                return <FaExclamationTriangle className="h-5 w-5 text-gray-400" />;
            default:
                return <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />;
        }
    };

    // Get status text
    const getStatusText = () => {
        switch (error.status) {
            case 'resolved':
                return <span className="text-green-500">Resolved</span>;
            case 'unresolved':
                return error.priority === 'critical' ? (
                    <span className="text-red-500">Critical</span>
                ) : (
                    <span className="text-yellow-500">Unresolved</span>
                );
            case 'muted':
                return <span className="text-gray-500">Muted</span>;
            default:
                return <span className="text-yellow-500">Unresolved</span>;
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Toggle checkbox
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCheckboxChange(error.id, e.target.checked);
    };

    // Handle card click
    const handleCardClick = () => {
        onSelect(error);
    };

    // Handle expand toggle
    const handleExpandToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div
            className={`border-l-4 ${
                error.status === 'resolved'
                    ? 'border-green-500'
                    : error.priority === 'critical'
                      ? 'border-red-500'
                      : error.status === 'muted'
                        ? 'border-gray-300 dark:border-gray-600'
                        : 'border-yellow-500'
            } transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700/50`}
        >
            <div className="cursor-pointer px-6 py-4" onClick={handleCardClick}>
                <div className="flex items-center">
                    <div className="w-8">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={isSelected}
                            onChange={handleCheckboxChange}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="grid flex-1 grid-cols-12 gap-4">
                        <div className="col-span-4">
                            <div className="flex items-start">
                                <div className="mt-0.5 flex-shrink-0">{getStatusIcon()}</div>
                                <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{error.type}</div>
                                    <div className="mt-1 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">{error.message}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                {error.environment}
                            </div>
                            {error.browser && (
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {error.browser} / {error.os}
                                </div>
                            )}
                        </div>
                        <div className="col-span-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{error.count}</div>
                        </div>
                        <div className="col-span-1">
                            <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                                {error.user_count || 0}
                                <FaUserFriends className="ml-1 h-3 w-3 text-gray-400" />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <FaCalendarAlt className="mr-1 h-3 w-3" />
                                {formatDate(error.last_seen)}
                            </div>
                        </div>
                        <div className="col-span-2 flex items-center justify-between">
                            <div className="text-sm font-medium">{getStatusText()}</div>
                            <button onClick={handleExpandToggle} className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-600">
                                {isExpanded ? (
                                    <FaChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                ) : (
                                    <FaChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 ml-8 border-l-2 border-gray-200 pl-3 dark:border-gray-700"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Details</h4>
                                <div className="space-y-2">
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">First Seen</div>
                                        <div className="text-sm text-gray-900 dark:text-white">{formatDate(error.first_seen)}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Last Seen</div>
                                        <div className="text-sm text-gray-900 dark:text-white">{formatDate(error.last_seen)}</div>
                                    </div>
                                    {error.assigned_to && (
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Assigned To</div>
                                            <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                <FaUserCircle className="mr-1 h-4 w-4 text-gray-400" />
                                                {error.assigned_to}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                    Additional Info
                                </h4>
                                {error.tags && error.tags.length > 0 && (
                                    <div className="mb-2">
                                        <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">Tags</div>
                                        <div className="flex flex-wrap gap-1">
                                            {error.tags.map((tag, index) => (
                                                <div
                                                    key={index}
                                                    className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                >
                                                    <FaTag className="mr-1 h-2 w-2" />
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {error.stack_trace && (
                                    <div>
                                        <div className="mb-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                            <FaCode className="mr-1 h-3 w-3" />
                                            Stack Trace Preview
                                        </div>
                                        <div className="max-h-20 overflow-x-auto rounded bg-gray-100 p-2 font-mono text-xs dark:bg-gray-800">
                                            {error.stack_trace.split('\n').slice(0, 3).join('\n')}
                                            {error.stack_trace.split('\n').length > 3 && '...'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                className="inline-flex items-center rounded border border-transparent bg-blue-100 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/40"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(error);
                                }}
                            >
                                View Full Details
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
