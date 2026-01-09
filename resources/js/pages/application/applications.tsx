import ApplicationCard from '@/components/application/application-card';
import ApplicationFilter, { FilterOptions } from '@/components/application/application-filter';
import CreateNewApplication from '@/components/application/create-application';
import { EmptyState } from '@/components/empty-state';
import AppLayout from '@/layouts/app-layout';
import { type Application, ApplicationType, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Applications',
        href: '/applications',
    },
];

interface Props {
    applications: Application[];
    applicationTypes: ApplicationType[];
    filters?: FilterOptions;
}

export default function Application({ applications: initialApplications, applicationTypes, filters = {} }: Props) {
    // State for filtered applications
    const [applications, setApplications] = useState<Application[]>(initialApplications);

    // Determine if we should show the "View All" link
    const showViewAll = initialApplications.length >= 6;

    // Handle filter changes
    const handleFilterChange = (newFilters: FilterOptions) => {
        // For the main applications page, we'll handle filtering client-side
        // This provides a more responsive experience since we're only showing a limited number of applications
        let filtered = [...initialApplications];

        // Apply search filter
        if (newFilters.search) {
            const searchLower = newFilters.search.toLowerCase();
            filtered = filtered.filter((app) => app.name.toLowerCase().includes(searchLower) || app.description.toLowerCase().includes(searchLower));
        }

        // Apply type filter
        if (newFilters.type) {
            filtered = filtered.filter((app) => app.type.slug === newFilters.type);
        }

        // Apply sorting
        if (newFilters.sortBy) {
            filtered.sort((a, b) => {
                const sortField = newFilters.sortBy as keyof Application;

                // Handle special case for nested type name
                if (sortField === 'name') {
                    return newFilters.sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                }

                // Handle date fields
                if (sortField === 'created_at' || sortField === 'updated_at') {
                    const dateA = new Date(a[sortField] as string).getTime();
                    const dateB = new Date(b[sortField] as string).getTime();
                    return newFilters.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
                }

                return 0;
            });
        }

        setApplications(filtered);
    };

    // Reset applications when initial applications change
    useEffect(() => {
        setApplications(initialApplications);
    }, [initialApplications]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl px-4 py-6 sm:px-6 lg:px-8">
                {initialApplications.length > 0 ? (
                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Applications</h2>
                                {showViewAll && (
                                    <Link
                                        href={route('applications.all')}
                                        className="mt-1 text-sm font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        VIEW ALL
                                    </Link>
                                )}
                            </div>
                            <CreateNewApplication applicationTypes={applicationTypes} />
                        </div>

                        {/* Search and Filter Component */}
                        <ApplicationFilter
                            applicationTypes={applicationTypes}
                            initialFilters={filters}
                            onFilterChange={handleFilterChange}
                            className="mb-6"
                        />

                        {applications.length > 0 ? (
                            <div className="grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-3">
                                {applications.slice(0, 6).map((application, index) => (
                                    <ApplicationCard key={index} application={application} />
                                ))}
                            </div>
                        ) : (
                            <div>
                                <EmptyState message="No application(s) found matching your filters." />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col items-center gap-4 rounded-xl p-4">
                        <EmptyState message="No application(s) found." />
                        <CreateNewApplication applicationTypes={applicationTypes} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
