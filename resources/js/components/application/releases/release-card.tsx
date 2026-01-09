import { motion } from 'framer-motion';
import React from 'react';
import { BiGitCommit } from 'react-icons/bi';
import { FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaTag, FaTimesCircle, FaUser } from 'react-icons/fa';

interface Change {
    type: 'feature' | 'bugfix' | 'improvement' | 'other';
    description: string;
}

export interface Release {
    id: string;
    version: string;
    description: string;
    created_at: string;
    author: string;
    commit_hash: string;
    status: 'deployed' | 'pending' | 'failed';
    environment: string;
    changes: Change[];
    error_count: number;
}

interface ReleaseCardProps {
    release: Release;
    onClick: (release: Release) => void;
}

export const ReleaseCard: React.FC<ReleaseCardProps> = ({ release, onClick }) => {
    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
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
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <FaCheckCircle className="mr-1 h-3 w-3" />
                        Deployed
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        <FaExclamationCircle className="mr-1 h-3 w-3" />
                        Pending
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        <FaTimesCircle className="mr-1 h-3 w-3" />
                        Failed
                    </span>
                );
            default:
                return null;
        }
    };

    // Get environment badge
    const getEnvironmentBadge = (environment: string) => {
        let bgColor = '';

        switch (environment) {
            case 'production':
                bgColor = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
                break;
            case 'staging':
                bgColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
                break;
            case 'development':
                bgColor = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
                break;
            default:
                bgColor = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }

        return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor}`}>{environment}</span>;
    };

    // Count changes by type
    const countChangesByType = (changes: Change[]) => {
        const counts = {
            feature: 0,
            bugfix: 0,
            improvement: 0,
            other: 0,
        };

        changes.forEach((change) => {
            counts[change.type]++;
        });

        return counts;
    };

    const changeCounts = countChangesByType(release.changes);

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            onClick={() => onClick(release)}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                        <FaTag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{release.version}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center">
                                <FaCalendarAlt className="mr-1 h-3 w-3" />
                                {formatDate(release.created_at)}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {getStatusBadge(release.status)}
                    {getEnvironmentBadge(release.environment)}
                </div>
            </div>

            <div className="mt-3">
                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{release.description}</p>
            </div>

            <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                    <FaUser className="mr-1 h-3 w-3" />
                    <span>{release.author}</span>
                </div>
                <div className="flex items-center">
                    <BiGitCommit className="mr-1 h-3 w-3" />
                    <span className="font-mono">{release.commit_hash.substring(0, 7)}</span>
                </div>
                {release.error_count > 0 && (
                    <div className="flex items-center text-red-500">
                        <FaExclamationTriangle className="mr-1 h-3 w-3" />
                        <span>{release.error_count} errors</span>
                    </div>
                )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {changeCounts.feature > 0 && (
                    <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {changeCounts.feature} features
                    </span>
                )}
                {changeCounts.bugfix > 0 && (
                    <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        {changeCounts.bugfix} bugfixes
                    </span>
                )}
                {changeCounts.improvement > 0 && (
                    <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {changeCounts.improvement} improvements
                    </span>
                )}
                {changeCounts.other > 0 && (
                    <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {changeCounts.other} other changes
                    </span>
                )}
            </div>
        </motion.div>
    );
};
