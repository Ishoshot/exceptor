import { type Application } from '@/types';
import { router } from '@inertiajs/react';
import { FaGithub, FaLink } from 'react-icons/fa';
import ApplicationIcon from './application-icon';

export default function ApplicationCard({ application }: { application: Application }) {
    return (
        <div
            className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            onClick={() => router.visit(route('applications.show', application.id))}
        >
            <div className="flex items-center justify-between">
                <h3 className="truncate text-xl font-semibold text-gray-900 dark:text-white" title={application.name}>
                    {application.name.length > 20 ? `${application.name.substring(0, 20)}...` : application.name}
                </h3>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2">
                {application.repository && (
                    <a
                        href={application.repository}
                        className="flex items-center gap-1 text-xs text-blue-500 hover:underline dark:text-blue-300"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaGithub className="h-3 w-3" />
                        <span>GitHub</span>
                    </a>
                )}
                {application.url && (
                    <a
                        href={application.url}
                        className="flex items-center gap-1 text-xs text-blue-500 hover:underline dark:text-blue-300"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaLink className="h-3 w-3" />
                        <span>Project</span>
                    </a>
                )}
            </div>

            <p className="mt-4 line-clamp-3 flex-grow text-sm text-gray-600 dark:text-gray-400">{application.description}</p>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <ApplicationIcon applicationSlug={application.type?.slug ?? 'laravel'} size={20} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{application.type?.name}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Last updated {new Date(application.updated_at).toLocaleTimeString()}</span>
            </div>
        </div>
    );
}
