import { motion } from 'framer-motion';
import React from 'react';
import { BiGitCommit } from 'react-icons/bi';
import {
    FaArrowLeft,
    FaArrowRight,
    FaCheckCircle,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaGithub,
    FaLink,
    FaServer,
    FaTag,
    FaTimes,
    FaTimesCircle,
    FaUser,
} from 'react-icons/fa';
import { Release } from './release-card';

interface ReleaseDetailsProps {
    release: Release;
    onClose: () => void;
}

export const ReleaseDetails: React.FC<ReleaseDetailsProps> = ({ release, onClose }) => {
    // Format date
    const formatDate = (dateString: string) => {
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

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'deployed':
                return (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <FaCheckCircle className="mr-2 h-4 w-4" />
                        Deployed Successfully
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        <FaExclamationCircle className="mr-2 h-4 w-4" />
                        Deployment Pending
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        <FaTimesCircle className="mr-2 h-4 w-4" />
                        Deployment Failed
                    </span>
                );
            default:
                return null;
        }
    };

    // Get change type badge
    const getChangeTypeBadge = (type: string) => {
        switch (type) {
            case 'feature':
                return (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Feature
                    </span>
                );
            case 'bugfix':
                return (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        Bugfix
                    </span>
                );
            case 'improvement':
                return (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Improvement
                    </span>
                );
            case 'other':
                return (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Other
                    </span>
                );
            default:
                return null;
        }
    };

    // Mock deployment logs
    const deploymentLogs = [
        { timestamp: '2023-03-23T10:15:32Z', message: 'Starting deployment process', level: 'info' },
        { timestamp: '2023-03-23T10:15:35Z', message: 'Pulling latest changes from repository', level: 'info' },
        { timestamp: '2023-03-23T10:15:42Z', message: 'Running build process', level: 'info' },
        { timestamp: '2023-03-23T10:16:15Z', message: 'Build completed successfully', level: 'info' },
        { timestamp: '2023-03-23T10:16:18Z', message: 'Running database migrations', level: 'info' },
        { timestamp: '2023-03-23T10:16:25Z', message: 'Database migrations completed', level: 'info' },
        { timestamp: '2023-03-23T10:16:30Z', message: 'Restarting application services', level: 'info' },
        { timestamp: '2023-03-23T10:16:45Z', message: 'Deployment completed successfully', level: 'success' },
    ];

    // Format log timestamp
    const formatLogTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    // Get log level color
    const getLogLevelColor = (level: string) => {
        switch (level) {
            case 'info':
                return 'text-blue-500';
            case 'success':
                return 'text-green-500';
            case 'warning':
                return 'text-yellow-500';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                        <FaTag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{release.version}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Released on {formatDate(release.created_at)}</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <FaTimes className="h-5 w-5" />
                </button>
            </div>

            <div className="mt-6">
                <div className="flex space-x-3">
                    {getStatusBadge(release.status)}
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        <FaServer className="mr-2 h-4 w-4" />
                        {release.environment}
                    </span>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Description</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{release.description}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                    <div className="flex items-center">
                        <FaUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <h4 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Author</h4>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{release.author}</p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                    <div className="flex items-center">
                        <BiGitCommit className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <h4 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Commit</h4>
                    </div>
                    <p className="mt-1 font-mono text-sm text-gray-600 dark:text-gray-300">{release.commit_hash}</p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                    <div className="flex items-center">
                        <FaExclamationTriangle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <h4 className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Errors</h4>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {release.error_count > 0 ? (
                            <span className="text-red-500">{release.error_count} errors detected</span>
                        ) : (
                            <span className="text-green-500">No errors detected</span>
                        )}
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Changes</h3>
                <ul className="mt-2 space-y-3">
                    {release.changes.map((change, index) => (
                        <li key={index} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                            <div className="flex items-start">
                                <div className="mt-0.5">{getChangeTypeBadge(change.type)}</div>
                                <p className="ml-2 text-sm text-gray-600 dark:text-gray-300">{change.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Deployment Logs</h3>
                <div className="mt-2 max-h-60 overflow-auto rounded-lg bg-gray-800 p-4 font-mono text-sm text-white">
                    {deploymentLogs.map((log, index) => (
                        <div key={index} className="mb-1">
                            <span className="text-gray-400">[{formatLogTimestamp(log.timestamp)}]</span>{' '}
                            <span className={getLogLevelColor(log.level)}>{log.message}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex justify-between">
                <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    <FaArrowLeft className="mr-2 -ml-1 h-4 w-4" />
                    Previous Release
                </button>

                <div className="flex space-x-3">
                    <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                        <FaGithub className="mr-2 -ml-1 h-4 w-4" />
                        View on GitHub
                    </button>

                    <button className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
                        <FaLink className="mr-2 -ml-1 h-4 w-4" />
                        View Deployment
                    </button>
                </div>

                <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                    Next Release
                    <FaArrowRight className="-mr-1 ml-2 h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
};
