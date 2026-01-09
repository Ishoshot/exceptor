import ApplicationIcon from '@/components/application/application-icon';
import { AlertsTab, ErrorsTab, LogsTab, OverviewTab, PerformanceTab, ReleasesTab, SettingsTab, TeamTab } from '@/components/application/tabs';
import AppLayout from '@/layouts/app-layout';
import { Application } from '@/types';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BiGitBranch } from 'react-icons/bi';
import {
    FaBell,
    FaChartLine,
    FaCheckCircle,
    FaClipboard,
    FaCloudDownloadAlt,
    FaCode,
    FaCog,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaLink,
    FaTimesCircle,
    FaUsers,
} from 'react-icons/fa';
import { SiGrafana } from 'react-icons/si';

interface ErrorStats {
    total: number;
    resolved: number;
    unresolved: number;
    critical: number;
    today: number;
    yesterday: number;
    this_week: number;
    last_week: number;
    by_environment: {
        [key: string]: number;
    };
    by_browser: {
        [key: string]: number;
    };
    by_os: {
        [key: string]: number;
    };
}

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

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'developer' | 'viewer';
    avatar: string;
    last_active: string;
    status: 'online' | 'away' | 'offline';
    joined_at: string;
    contributions: number;
    recent_activity: {
        action: string;
        timestamp: string;
    }[];
}

interface Release {
    id: string;
    version: string;
    description: string;
    created_at: string;
    author: string;
    commit_hash: string;
    status: 'deployed' | 'pending' | 'failed';
    environment: string;
    changes: {
        type: 'feature' | 'bugfix' | 'improvement' | 'other';
        description: string;
    }[];
    error_count: number;
}

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

interface Props {
    application: Application;
    errorStats: ErrorStats;
    performanceData: PerformanceData;
    recentErrors: RecentError[];
    teamMembers: TeamMember[];
    releases: Release[];
    alerts: Alert[];
}

export default function ApplicationII({ application, errorStats, performanceData, recentErrors, teamMembers, releases, alerts }: Props) {
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [isSticky, setIsSticky] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    const tabs = [
        { name: 'Overview', icon: <FaChartLine /> },
        { name: 'Errors', icon: <FaExclamationTriangle />, count: errorStats.unresolved },
        { name: 'Performance', icon: <SiGrafana /> },
        { name: 'Logs', icon: <FaClipboard /> },
        { name: 'Releases', icon: <BiGitBranch />, count: releases.length },
        { name: 'Alerts', icon: <FaBell />, count: alerts.filter((a) => a.status === 'active').length },
        { name: 'Team', icon: <FaUsers />, count: teamMembers.length },
        { name: 'Settings', icon: <FaCog /> },
    ];

    const breadcrumbs = [
        { title: 'Applications', href: route('applications.index') },
        { title: application.name, href: route('applications.show', application.id) },
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current) {
                const headerBottom = headerRef.current.getBoundingClientRect().bottom;
                setIsSticky(headerBottom <= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const getStatusColor = () => {
        if (errorStats.critical > 0) return 'bg-red-500';
        if (errorStats.unresolved > 0) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={application.name} />

            <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
                {/* Application Header */}
                <div ref={headerRef} className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center">
                                <div className="relative">
                                    <div className="mr-4 rounded-md bg-gray-100 p-3 dark:bg-gray-700">
                                        <ApplicationIcon applicationSlug={application.type?.slug ?? 'laravel'} size={40} />
                                    </div>
                                    <div
                                        className={`absolute -top-1 -right-1 h-3 w-3 ${getStatusColor()} rounded-full border-2 border-white dark:border-gray-800`}
                                    ></div>
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{application.name}</h1>
                                        <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                            {application.type?.name}
                                        </span>
                                        {application.url && (
                                            <a
                                                href={application.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                <FaLink className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <span>Last updated {new Date(application.updated_at).toLocaleString()}</span>
                                        <span className="mx-2">•</span>
                                        <span className="flex items-center">
                                            <FaUsers className="mr-1 h-3 w-3" />
                                            {teamMembers.length} team members
                                        </span>
                                        <span className="mx-2">•</span>
                                        <span className="flex items-center">
                                            <FaExclamationTriangle className="mr-1 h-3 w-3" />
                                            {errorStats.unresolved} unresolved errors
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex space-x-3 md:mt-0">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    <FaCode className="mr-2 h-4 w-4" />
                                    Setup Instructions
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    <FaCloudDownloadAlt className="mr-2 h-4 w-4" />
                                    Download SDK
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Tab Navigation */}
                <div
                    className={`${isSticky ? 'sticky top-0 z-10 shadow-md' : ''} border-b border-gray-200 bg-white transition-all duration-200 dark:border-gray-700 dark:bg-gray-800`}
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="hide-scrollbar flex gap-1 overflow-x-auto py-3">
                            {tabs.map((tab, index) => (
                                <motion.button
                                    key={tab.name}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ y: 0 }}
                                    onClick={() => setSelectedTabIndex(index)}
                                    className={`flex items-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap ${
                                        selectedTabIndex === index
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.name}
                                    {tab.count !== undefined && (
                                        <span
                                            className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                                                selectedTabIndex === index
                                                    ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                                                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error Stats Summary */}
                <div className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="flex items-center">
                                    <FaExclamationTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Errors</span>
                                </div>
                                <div className="mt-2 flex items-baseline">
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-2xl font-semibold text-gray-900 dark:text-white"
                                    >
                                        {errorStats.total}
                                    </motion.span>
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">all time</span>
                                </div>
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {errorStats.today > 0 && <span className="text-red-500">+{errorStats.today} today</span>}
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="flex items-center">
                                    <FaCheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</span>
                                </div>
                                <div className="mt-2 flex items-baseline">
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        className="text-2xl font-semibold text-gray-900 dark:text-white"
                                    >
                                        {errorStats.resolved}
                                    </motion.span>
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                        ({Math.round((errorStats.resolved / errorStats.total) * 100)}%)
                                    </span>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.round((errorStats.resolved / errorStats.total) * 100)}%` }}
                                        transition={{ duration: 1 }}
                                        className="h-1.5 rounded-full bg-green-500"
                                    ></motion.div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="flex items-center">
                                    <FaTimesCircle className="mr-2 h-5 w-5 text-red-500" />
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Unresolved</span>
                                </div>
                                <div className="mt-2 flex items-baseline">
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="text-2xl font-semibold text-gray-900 dark:text-white"
                                    >
                                        {errorStats.unresolved}
                                    </motion.span>
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                        ({Math.round((errorStats.unresolved / errorStats.total) * 100)}%)
                                    </span>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.round((errorStats.unresolved / errorStats.total) * 100)}%` }}
                                        transition={{ duration: 1 }}
                                        className="h-1.5 rounded-full bg-red-500"
                                    ></motion.div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="flex items-center">
                                    <FaExclamationCircle className="mr-2 h-5 w-5 text-red-600" />
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Critical</span>
                                </div>
                                <div className="mt-2 flex items-baseline">
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        className="text-2xl font-semibold text-gray-900 dark:text-white"
                                    >
                                        {errorStats.critical}
                                    </motion.span>
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">need attention</span>
                                </div>
                                <div className="mt-1 flex items-center text-xs">
                                    {errorStats.critical > 0 ? (
                                        <span className="flex items-center text-red-500">
                                            <FaExclamationCircle className="mr-1" /> Immediate action required
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-green-500">
                                            <FaCheckCircle className="mr-1" /> No critical issues
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedTabIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {selectedTabIndex === 0 && (
                                    <OverviewTab
                                        application={application}
                                        errorStats={errorStats}
                                        performanceData={performanceData}
                                        recentErrors={recentErrors}
                                        releases={releases}
                                        alerts={alerts}
                                    />
                                )}
                                {selectedTabIndex === 1 && <ErrorsTab recentErrors={recentErrors} />}
                                {selectedTabIndex === 2 && <PerformanceTab performanceData={performanceData} />}
                                {selectedTabIndex === 3 && <LogsTab application={application} />}
                                {selectedTabIndex === 4 && <ReleasesTab releases={releases} />}
                                {selectedTabIndex === 5 && <AlertsTab alerts={alerts} />}
                                {selectedTabIndex === 6 && <TeamTab teamMembers={teamMembers} />}
                                {selectedTabIndex === 7 && <SettingsTab application={application} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
