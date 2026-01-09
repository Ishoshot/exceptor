import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
    FaBell,
    FaChartLine,
    FaCheckCircle,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaHistory,
    FaPause,
    FaPen,
    FaPlay,
    FaTimes,
    FaTimesCircle,
    FaTrash,
} from 'react-icons/fa';
import { Alert } from './alert-card';

interface AlertDetailsProps {
    alert: Alert;
    onClose: () => void;
}

export const AlertDetails: React.FC<AlertDetailsProps> = ({ alert, onClose }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'history' | 'analytics'>('details');

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Never';

        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get severity name and icon
    const getSeverityInfo = (severity: string) => {
        switch (severity) {
            case 'critical':
                return {
                    name: 'Critical',
                    icon: <FaExclamationTriangle className="h-6 w-6 text-red-500" />,
                    bgClass: 'bg-red-100 dark:bg-red-900/30',
                    textClass: 'text-red-800 dark:text-red-300',
                };
            case 'error':
                return {
                    name: 'Error',
                    icon: <FaExclamationCircle className="h-6 w-6 text-orange-500" />,
                    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
                    textClass: 'text-orange-800 dark:text-orange-300',
                };
            case 'warning':
                return {
                    name: 'Warning',
                    icon: <FaExclamationCircle className="h-6 w-6 text-yellow-500" />,
                    bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
                    textClass: 'text-yellow-800 dark:text-yellow-300',
                };
            case 'info':
                return {
                    name: 'Info',
                    icon: <FaBell className="h-6 w-6 text-blue-500" />,
                    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
                    textClass: 'text-blue-800 dark:text-blue-300',
                };
            default:
                return {
                    name: 'Unknown',
                    icon: <FaBell className="h-6 w-6 text-gray-500" />,
                    bgClass: 'bg-gray-100 dark:bg-gray-700',
                    textClass: 'text-gray-800 dark:text-gray-300',
                };
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        <FaExclamationCircle className="mr-2 h-4 w-4" />
                        Active
                    </span>
                );
            case 'resolved':
                return (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <FaCheckCircle className="mr-2 h-4 w-4" />
                        Resolved
                    </span>
                );
            case 'snoozed':
                return (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        <FaTimesCircle className="mr-2 h-4 w-4" />
                        Snoozed
                    </span>
                );
            default:
                return null;
        }
    };

    // Mock alert history
    const alertHistory = [
        { timestamp: '2023-03-22T14:30:00Z', event: 'Alert triggered', details: `${alert.metric} exceeded threshold (${alert.threshold})` },
        { timestamp: '2023-03-22T14:35:00Z', event: 'Notification sent', details: 'Email sent to team@example.com' },
        { timestamp: '2023-03-22T14:35:01Z', event: 'Notification sent', details: 'Slack message sent to #alerts channel' },
        { timestamp: '2023-03-22T15:45:00Z', event: 'Alert resolved', details: `${alert.metric} returned to normal (${alert.current_value})` },
        { timestamp: '2023-03-20T09:15:00Z', event: 'Alert triggered', details: `${alert.metric} exceeded threshold (${alert.threshold})` },
        { timestamp: '2023-03-20T09:20:00Z', event: 'Notification sent', details: 'Email sent to team@example.com' },
        { timestamp: '2023-03-20T09:20:01Z', event: 'Notification sent', details: 'Slack message sent to #alerts channel' },
        { timestamp: '2023-03-20T10:30:00Z', event: 'Alert resolved', details: `${alert.metric} returned to normal (${alert.current_value})` },
    ];

    // Format history timestamp
    const formatHistoryTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    // Render details tab
    const renderDetailsTab = () => {
        const severityInfo = getSeverityInfo(alert.severity);

        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Description</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{alert.description}</p>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Condition</h3>
                    <div className="mt-2 rounded bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">{alert.condition}</div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Metrics</h3>
                    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="px-4 py-5 sm:p-6">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{alert.metric}</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{alert.current_value}</dd>
                                    <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400">Current value</dd>
                                </dl>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                            <div className="px-4 py-5 sm:p-6">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Threshold</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{alert.threshold}</dd>
                                    <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Alert triggers when {alert.metric} {alert.condition.includes('exceeds') ? 'exceeds' : 'falls below'} this
                                        value
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Alert Information</h3>
                    <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(alert.created_at)}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{getStatusBadge(alert.status)}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Severity</dt>
                            <dd className="mt-1 text-sm">
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${severityInfo.bgClass} ${severityInfo.textClass}`}
                                >
                                    {severityInfo.name}
                                </span>
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Triggered Count</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{alert.triggered_count} times</dd>
                        </div>
                        {alert.resolved_at && (
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved At</dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(alert.resolved_at)}</dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
        );
    };

    // Render history tab
    const renderHistoryTab = () => (
        <div className="space-y-6">
            <div className="flow-root">
                <ul className="-mb-8">
                    {alertHistory.map((historyItem, index) => (
                        <li key={index}>
                            <div className="relative pb-8">
                                {index !== alertHistory.length - 1 ? (
                                    <span
                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                                        aria-hidden="true"
                                    ></span>
                                ) : null}
                                <div className="relative flex space-x-3">
                                    <div>
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white dark:bg-gray-700 dark:ring-gray-800">
                                            {historyItem.event.includes('triggered') ? (
                                                <FaExclamationCircle className="h-4 w-4 text-red-500" />
                                            ) : historyItem.event.includes('resolved') ? (
                                                <FaCheckCircle className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <FaBell className="h-4 w-4 text-blue-500" />
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                        <div>
                                            <p className="text-sm text-gray-900 dark:text-white">{historyItem.event}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{historyItem.details}</p>
                                        </div>
                                        <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                            {formatHistoryTimestamp(historyItem.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    // Render analytics tab
    const renderAnalyticsTab = () => (
        <div className="space-y-6">
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Alert Frequency</h3>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">Chart showing alert frequency over time would be displayed here</p>
                </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">{alert.metric} Trend</h3>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">Chart showing {alert.metric} values over time would be displayed here</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-white">Average Duration</h3>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">45 min</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Average time until alert is resolved</p>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-white">Response Time</h3>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">12 min</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Average time until first action taken</p>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-white">Frequency</h3>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{alert.triggered_count} times</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total number of times triggered</p>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800"
        >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <div className="flex items-center">
                    <div className={`rounded-md p-2 ${getSeverityInfo(alert.severity).bgClass}`}>{getSeverityInfo(alert.severity).icon}</div>
                    <div className="ml-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{alert.name}</h2>
                        <div className="mt-1 flex items-center">
                            {getStatusBadge(alert.status)}
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">ID: {alert.id}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:hover:text-gray-300"
                >
                    <span className="sr-only">Close</span>
                    <FaTimes className="h-5 w-5" />
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`w-1/3 border-b-2 px-1 py-4 text-center text-sm font-medium ${
                            activeTab === 'details'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`w-1/3 border-b-2 px-1 py-4 text-center text-sm font-medium ${
                            activeTab === 'history'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <div className="flex items-center justify-center">
                            <FaHistory className="mr-2 h-4 w-4" />
                            History
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`w-1/3 border-b-2 px-1 py-4 text-center text-sm font-medium ${
                            activeTab === 'analytics'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                    >
                        <div className="flex items-center justify-center">
                            <FaChartLine className="mr-2 h-4 w-4" />
                            Analytics
                        </div>
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="px-6 py-4">
                {activeTab === 'details' && renderDetailsTab()}
                {activeTab === 'history' && renderHistoryTab()}
                {activeTab === 'analytics' && renderAnalyticsTab()}
            </div>

            {/* Actions */}
            <div className="flex justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-600 dark:bg-gray-700">
                <div>
                    {alert.status === 'active' ? (
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <FaPause className="mr-2 -ml-0.5 h-4 w-4" />
                            Snooze Alert
                        </button>
                    ) : alert.status === 'snoozed' ? (
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <FaPlay className="mr-2 -ml-0.5 h-4 w-4" />
                            Resume Alert
                        </button>
                    ) : null}
                </div>
                <div className="flex space-x-3">
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <FaPen className="mr-2 -ml-0.5 h-4 w-4" />
                        Edit
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm leading-4 font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                    >
                        <FaTrash className="mr-2 -ml-0.5 h-4 w-4" />
                        Delete
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
