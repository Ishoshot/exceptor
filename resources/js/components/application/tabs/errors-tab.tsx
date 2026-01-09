import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaBug, FaChartBar, FaDownload, FaEyeSlash, FaFilter, FaListUl, FaSearch, FaSort, FaSortDown, FaSortUp, FaThLarge } from 'react-icons/fa';
import { ErrorBulkActions } from '../errors/error-bulk-actions';
import { ErrorCard } from '../errors/error-card';
import { ErrorChart } from '../errors/error-chart';
import { ErrorDetails } from '../errors/error-details';
import { ErrorFilterPanel } from '../errors/error-filter-panel';

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

interface ErrorsTabProps {
    recentErrors: RecentError[];
}

export const ErrorsTab: React.FC<ErrorsTabProps> = ({ recentErrors }) => {
    // State for filtering and sorting
    const [filteredErrors, setFilteredErrors] = useState<RecentError[]>(recentErrors);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
    const [sortField, setSortField] = useState<keyof RecentError>('last_seen');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedError, setSelectedError] = useState<RecentError | null>(null);
    const [selectedErrors, setSelectedErrors] = useState<string[]>([]);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [isChartVisible, setIsChartVisible] = useState(true);

    // Get unique environments from errors
    const environments = [...new Set(recentErrors.map((error) => error.environment))];

    // Get unique statuses from errors
    const statuses = [...new Set(recentErrors.map((error) => error.status))];

    // Get unique priorities from errors
    const priorities = [...new Set(recentErrors.filter((error) => error.priority).map((error) => error.priority))];

    // Filter and sort errors
    useEffect(() => {
        let result = [...recentErrors];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((error) => error.message.toLowerCase().includes(query) || error.type.toLowerCase().includes(query));
        }

        // Apply status filter
        if (selectedStatus.length > 0) {
            result = result.filter((error) => selectedStatus.includes(error.status));
        }

        // Apply environment filter
        if (selectedEnvironments.length > 0) {
            result = result.filter((error) => selectedEnvironments.includes(error.environment));
        }

        // Apply priority filter
        if (selectedPriorities.length > 0) {
            result = result.filter((error) => error.priority && selectedPriorities.includes(error.priority));
        }

        // Apply sorting
        result.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });

        setFilteredErrors(result);
    }, [recentErrors, searchQuery, selectedStatus, selectedEnvironments, selectedPriorities, sortField, sortDirection]);

    // Handle sort change
    const handleSortChange = (field: keyof RecentError) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Handle error selection
    const handleErrorSelect = (error: RecentError) => {
        setSelectedError(error);
    };

    // Handle error checkbox selection
    const handleErrorCheckboxChange = (errorId: string, checked: boolean) => {
        if (checked) {
            setSelectedErrors([...selectedErrors, errorId]);
        } else {
            setSelectedErrors(selectedErrors.filter((id) => id !== errorId));
        }
    };

    // Handle select all errors
    const handleSelectAllErrors = (checked: boolean) => {
        if (checked) {
            setSelectedErrors(filteredErrors.map((error) => error.id));
        } else {
            setSelectedErrors([]);
        }
    };

    // Handle bulk resolve
    const handleBulkResolve = () => {
        // In a real app, this would call an API to resolve the selected errors
        console.log('Resolving errors:', selectedErrors);
        setSelectedErrors([]);
    };

    // Handle bulk mute
    const handleBulkMute = () => {
        // In a real app, this would call an API to mute the selected errors
        console.log('Muting errors:', selectedErrors);
        setSelectedErrors([]);
    };

    // Handle bulk delete
    const handleBulkDelete = () => {
        // In a real app, this would call an API to delete the selected errors
        console.log('Deleting errors:', selectedErrors);
        setSelectedErrors([]);
    };

    // Get sort icon
    const getSortIcon = (field: keyof RecentError) => {
        if (field !== sortField) return <FaSort className="text-gray-400" />;
        return sortDirection === 'asc' ? <FaSortUp className="text-blue-500" /> : <FaSortDown className="text-blue-500" />;
    };

    return (
        <div className="space-y-6">
            {/* Error Chart */}
            <AnimatePresence>
                {isChartVisible && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Error Trends</h3>
                                <button
                                    onClick={() => setIsChartVisible(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    <FaEyeSlash className="h-4 w-4" />
                                </button>
                            </div>
                            <ErrorChart />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Controls */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="p-4">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        {/* Search */}
                        <div className="relative max-w-md flex-1">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaSearch className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="Search errors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                                className={`inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm leading-4 font-medium shadow-sm dark:border-gray-600 ${
                                    isFilterPanelOpen || selectedStatus.length > 0 || selectedEnvironments.length > 0 || selectedPriorities.length > 0
                                        ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-500'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                } focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none`}
                            >
                                <FaFilter
                                    className={`mr-2 h-4 w-4 ${
                                        isFilterPanelOpen ||
                                        selectedStatus.length > 0 ||
                                        selectedEnvironments.length > 0 ||
                                        selectedPriorities.length > 0
                                            ? 'text-white'
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                />
                                Filters
                                {(selectedStatus.length > 0 || selectedEnvironments.length > 0 || selectedPriorities.length > 0) && (
                                    <span className="ml-1 inline-flex items-center rounded-full bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {selectedStatus.length + selectedEnvironments.length + selectedPriorities.length}
                                    </span>
                                )}
                            </button>

                            {!isChartVisible && (
                                <button
                                    onClick={() => setIsChartVisible(true)}
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    <FaChartBar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    Show Chart
                                </button>
                            )}

                            <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                                <FaDownload className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                Export
                            </button>

                            <div className="flex overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${
                                        viewMode === 'list'
                                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white'
                                            : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <FaListUl className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${
                                        viewMode === 'grid'
                                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white'
                                            : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    <FaThLarge className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Panel */}
                <AnimatePresence>
                    {isFilterPanelOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ErrorFilterPanel
                                statuses={statuses}
                                environments={environments}
                                priorities={priorities as any[]}
                                selectedStatus={selectedStatus}
                                selectedEnvironments={selectedEnvironments}
                                selectedPriorities={selectedPriorities}
                                onStatusChange={setSelectedStatus}
                                onEnvironmentChange={setSelectedEnvironments}
                                onPriorityChange={setSelectedPriorities}
                                onClearFilters={() => {
                                    setSelectedStatus([]);
                                    setSelectedEnvironments([]);
                                    setSelectedPriorities([]);
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Error List */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                {/* Error List Header */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center px-6 py-3">
                        <div className="w-8">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={selectedErrors.length === filteredErrors.length && filteredErrors.length > 0}
                                onChange={(e) => handleSelectAllErrors(e.target.checked)}
                            />
                        </div>
                        <div className="grid flex-1 grid-cols-12 gap-4">
                            <div className="col-span-4 flex cursor-pointer items-center" onClick={() => handleSortChange('type')}>
                                <span className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Error</span>
                                <span className="ml-1">{getSortIcon('type')}</span>
                            </div>
                            <div className="col-span-2 flex cursor-pointer items-center" onClick={() => handleSortChange('environment')}>
                                <span className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Environment</span>
                                <span className="ml-1">{getSortIcon('environment')}</span>
                            </div>
                            <div className="col-span-1 flex cursor-pointer items-center" onClick={() => handleSortChange('count')}>
                                <span className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Count</span>
                                <span className="ml-1">{getSortIcon('count')}</span>
                            </div>
                            <div className="col-span-1 flex cursor-pointer items-center" onClick={() => handleSortChange('user_count')}>
                                <span className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Users</span>
                                <span className="ml-1">{getSortIcon('user_count')}</span>
                            </div>
                            <div className="col-span-2 flex cursor-pointer items-center" onClick={() => handleSortChange('last_seen')}>
                                <span className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Last Seen</span>
                                <span className="ml-1">{getSortIcon('last_seen')}</span>
                            </div>
                            <div className="col-span-2 flex cursor-pointer items-center" onClick={() => handleSortChange('status')}>
                                <span className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Status</span>
                                <span className="ml-1">{getSortIcon('status')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error List Content */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredErrors.length === 0 ? (
                        <div className="py-12 text-center">
                            <FaBug className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No errors found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Try adjusting your search or filter to find what you're looking for.
                            </p>
                            {(searchQuery || selectedStatus.length > 0 || selectedEnvironments.length > 0 || selectedPriorities.length > 0) && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedStatus([]);
                                            setSelectedEnvironments([]);
                                            setSelectedPriorities([]);
                                        }}
                                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            {filteredErrors.map((error) => (
                                <ErrorCard
                                    key={error.id}
                                    error={error}
                                    isSelected={selectedErrors.includes(error.id)}
                                    onSelect={handleErrorSelect}
                                    onCheckboxChange={handleErrorCheckboxChange}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Error Details Modal */}
            <AnimatePresence>{selectedError && <ErrorDetails error={selectedError} onClose={() => setSelectedError(null)} />}</AnimatePresence>

            {/* Bulk Actions */}
            <AnimatePresence>
                {selectedErrors.length > 0 && (
                    <ErrorBulkActions
                        selectedCount={selectedErrors.length}
                        onResolve={handleBulkResolve}
                        onMute={handleBulkMute}
                        onDelete={handleBulkDelete}
                        onClearSelection={() => setSelectedErrors([])}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
