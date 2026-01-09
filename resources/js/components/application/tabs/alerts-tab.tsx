import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaBell, FaPlus, FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { AlertCard } from '../alerts/alert-card';
import { AlertDetails } from '../alerts/alert-details';
import { AlertFilter, AlertFilters } from '../alerts/alert-filter';

// Interface to match the Alert type in application-ii.tsx
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

interface AlertsTabProps {
    alerts: Alert[];
}

export const AlertsTab: React.FC<AlertsTabProps> = ({ alerts }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState<AlertFilters>({
        status: [],
        type: [],
        timeRange: 'all',
    });

    // Filter alerts based on search query and filters
    const filteredAlerts = alerts.filter((alert) => {
        // Search query filter
        const matchesSearch =
            searchQuery === '' ||
            alert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus = filters.status.length === 0 || filters.status.includes(alert.status);

        // Type filter - map severity to type for filtering
        const alertType = alert.severity;
        const matchesType = filters.type.length === 0 || filters.type.includes(alertType);

        // Time range filter
        let matchesTimeRange = true;
        const alertDate = new Date(alert.created_at);
        const now = new Date();

        if (filters.timeRange === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            matchesTimeRange = alertDate >= today;
        } else if (filters.timeRange === 'yesterday') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            matchesTimeRange = alertDate >= yesterday && alertDate < today;
        } else if (filters.timeRange === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesTimeRange = alertDate >= weekAgo;
        } else if (filters.timeRange === 'month') {
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            matchesTimeRange = alertDate >= monthAgo;
        } else if (filters.timeRange === 'quarter') {
            const quarterAgo = new Date();
            quarterAgo.setDate(quarterAgo.getDate() - 90);
            matchesTimeRange = alertDate >= quarterAgo;
        }

        return matchesSearch && matchesStatus && matchesType && matchesTimeRange;
    });

    // Sort alerts
    const sortedAlerts = [...filteredAlerts].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();

        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // Handle alert click
    const handleAlertClick = (alert: Alert) => {
        setSelectedAlert(alert);
    };

    // Handle close details
    const handleCloseDetails = () => {
        setSelectedAlert(null);
    };

    // Handle filter change
    const handleFilterChange = (newFilters: AlertFilters) => {
        setFilters(newFilters);
    };

    // Handle clear filters
    const handleClearFilters = () => {
        setFilters({
            status: [],
            type: [],
            timeRange: 'all',
        });
    };

    // Toggle sort direction
    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
            {selectedAlert ? (
                <AlertDetails alert={selectedAlert} onClose={handleCloseDetails} />
            ) : (
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Alerts</h2>

                        <div className="flex space-x-2">
                            <button
                                onClick={toggleSortDirection}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                {sortDirection === 'desc' ? (
                                    <>
                                        <FaSortAmountDown className="mr-2 -ml-0.5 h-4 w-4" />
                                        Newest First
                                    </>
                                ) : (
                                    <>
                                        <FaSortAmountUp className="mr-2 -ml-0.5 h-4 w-4" />
                                        Oldest First
                                    </>
                                )}
                            </button>

                            <button className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm leading-4 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
                                <FaPlus className="mr-2 -ml-0.5 h-4 w-4" />
                                Create Alert
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 md:flex-row">
                        {/* Filters sidebar */}
                        <div className="w-full flex-shrink-0 md:w-64">
                            <AlertFilter onFilterChange={handleFilterChange} filters={filters} onClearFilters={handleClearFilters} />
                        </div>

                        {/* Alerts list */}
                        <div className="flex-1">
                            {/* Search bar */}
                            <div className="relative mb-4">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FaSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="Search alerts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Alerts grid */}
                            {sortedAlerts.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {sortedAlerts.map((alert) => (
                                        <AlertCard key={alert.id} alert={alert} onClick={handleAlertClick} />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg bg-white p-6 text-center shadow dark:bg-gray-800">
                                    <FaBell className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No alerts found</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {searchQuery ||
                                        Object.values(filters).some((f) => (Array.isArray(f) ? f.length > 0 : f !== '' && f !== 'all'))
                                            ? 'Try adjusting your search or filter criteria.'
                                            : 'Get started by creating your first alert.'}
                                    </p>
                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                        >
                                            <FaPlus className="mr-2 -ml-1 h-4 w-4" />
                                            Create Alert
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
