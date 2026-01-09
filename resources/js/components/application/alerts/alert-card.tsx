import { motion } from 'framer-motion';
import React from 'react';
import { FaBell, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

export interface Alert {
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

interface AlertCardProps {
    alert: Alert;
    onClick: (alert: Alert) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onClick }) => {
    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Never';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get alert type icon
    const getAlertTypeIcon = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <FaExclamationTriangle className="h-5 w-5 text-red-500" />;
            case 'error':
                return <FaExclamationCircle className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <FaExclamationCircle className="h-5 w-5 text-yellow-500" />;
            case 'info':
                return <FaBell className="h-5 w-5 text-blue-500" />;
            default:
                return <FaBell className="h-5 w-5 text-gray-500" />;
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        <FaExclamationCircle className="mr-1 h-3 w-3" />
                        Active
                    </span>
                );
            case 'resolved':
                return (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <FaCheckCircle className="mr-1 h-3 w-3" />
                        Resolved
                    </span>
                );
            case 'snoozed':
                return (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        <FaTimesCircle className="mr-1 h-3 w-3" />
                        Snoozed
                    </span>
                );
            default:
                return null;
        }
    };

    // Get severity badge
    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'critical':
                return (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        Critical
                    </span>
                );
            case 'error':
                return (
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                        Error
                    </span>
                );
            case 'warning':
                return (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        Warning
                    </span>
                );
            case 'info':
                return (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Info
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            onClick={() => onClick(alert)}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                        {getAlertTypeIcon(alert.severity)}
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{alert.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center">
                                <FaCalendarAlt className="mr-1 h-3 w-3" />
                                Created {formatDate(alert.created_at)}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                    {getStatusBadge(alert.status)}
                    {getSeverityBadge(alert.severity)}
                </div>
            </div>

            <div className="mt-3">
                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{alert.description}</p>
            </div>

            <div className="mt-3 rounded bg-gray-50 p-2 text-xs text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
                <strong>Condition:</strong> {alert.condition} ({alert.metric})
            </div>

            <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-600 dark:text-gray-300">
                    <strong>Threshold:</strong> {alert.threshold}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                    <strong>Current:</strong> {alert.current_value}
                </div>
            </div>

            {alert.resolved_at && (
                <div className="mt-3 text-xs text-green-500 dark:text-green-400">
                    <span className="inline-flex items-center">
                        <FaCheckCircle className="mr-1 h-3 w-3" />
                        Resolved: {formatDate(alert.resolved_at)}
                    </span>
                </div>
            )}

            {alert.triggered_count > 0 && (
                <div className="mt-3 text-xs text-red-500 dark:text-red-400">
                    <span className="inline-flex items-center">
                        <FaExclamationCircle className="mr-1 h-3 w-3" />
                        Triggered {alert.triggered_count} {alert.triggered_count === 1 ? 'time' : 'times'}
                    </span>
                </div>
            )}
        </motion.div>
    );
};
