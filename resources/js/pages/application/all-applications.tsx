import ApplicationCard from '@/components/application/application-card';
import ApplicationFilter, { FilterOptions } from '@/components/application/application-filter';
import ApplicationIcon from '@/components/application/application-icon';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type Application, type ApplicationType, type BreadcrumbItem, type PaginatedData } from '@/types';
import { Head, router, useRemember } from '@inertiajs/react';
import { GridIcon, ListIcon, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Applications',
        href: '/applications',
    },
    {
        title: 'All Applications',
        href: '/applications/all',
    },
];

interface Props {
    applications: PaginatedData<Application>;
    applicationTypes: ApplicationType[];
    filters?: FilterOptions;
}

export default function AllApplications({ applications: initialApplications, applicationTypes, filters: initialFilters = {} }: Props) {
    // State to track the current view mode (grid or list)
    const [viewMode, setViewMode] = useRemember<'grid' | 'list'>('grid', 'viewMode');

    // State for applications with infinite scroll
    const [applications, setApplications] = useState<PaginatedData<Application>>(initialApplications);
    const [loading, setLoading] = useState(false);
    const [currentFilters, setCurrentFilters] = useState<FilterOptions>(initialFilters);

    // Reference to the loader element
    const loaderRef = useRef<HTMLDivElement>(null);

    // Toggle between grid and list view
    const toggleViewMode = () => {
        setViewMode(viewMode === 'grid' ? 'list' : 'grid');
    };

    // Reset applications data when filters change
    const handleFilterChange = useCallback((newFilters: FilterOptions) => {
        // Update current filters state
        setCurrentFilters(newFilters);
        setLoading(true);

        // Make request with new filters
        router.visit(route('applications.all'), {
            data: newFilters as Record<string, any>,
            preserveScroll: true,
            preserveState: true,
            only: ['applications'],
            onSuccess: (page) => {
                // Replace the applications data with the filtered results
                const newData = page.props.applications as PaginatedData<Application>;
                setApplications(newData);
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    }, []);

    // Load more applications for infinite scroll
    const loadMoreApplications = useCallback(() => {
        if (!applications.next_page_url || loading) return;

        setLoading(true);

        router.visit(applications.next_page_url, {
            data: currentFilters as Record<string, any>,
            preserveScroll: true,
            preserveState: true,
            only: ['applications'],
            onSuccess: (page) => {
                const newData = page.props.applications as PaginatedData<Application>;

                // Merge the new data with existing data
                setApplications((prev) => ({
                    ...newData,
                    data: [...prev.data, ...newData.data],
                }));

                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    }, [applications.next_page_url, loading, currentFilters]);

    // Set up the intersection observer for infinite scrolling
    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && applications.next_page_url && !loading) {
                    loadMoreApplications();
                }
            },
            { threshold: 0.5 },
        );

        observer.observe(loaderRef.current);

        return () => {
            observer.disconnect();
        };
    }, [applications.next_page_url, loading, loadMoreApplications]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Applications" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">All Applications</h1>

                    {/* View mode toggle */}
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={toggleViewMode} className="flex items-center gap-2">
                            {viewMode === 'grid' ? (
                                <>
                                    <ListIcon className="h-4 w-4" />
                                    <span>List View</span>
                                </>
                            ) : (
                                <>
                                    <GridIcon className="h-4 w-4" />
                                    <span>Grid View</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Search and Filter Component */}
                <ApplicationFilter
                    applicationTypes={applicationTypes}
                    initialFilters={currentFilters}
                    className="mb-6"
                    onFilterChange={handleFilterChange}
                />

                {applications.data.length > 0 ? (
                    viewMode === 'grid' ? (
                        // Grid View with fixed width cards
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {applications.data.map((application) => (
                                <div key={application.id} className="h-full w-full">
                                    <ApplicationCard application={application} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        // List View
                        <div className="space-y-4">
                            {applications.data.map((application) => (
                                <div
                                    key={application.id}
                                    className="flex items-center justify-between rounded-lg bg-white p-4 shadow dark:bg-gray-800"
                                >
                                    <div className="flex items-center space-x-4">
                                        <ApplicationIcon applicationSlug={application.type.slug} size={24} />
                                        <div className="w-64">
                                            <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white" title={application.name}>
                                                {application.name.length > 15 ? `${application.name.substring(0, 15)}...` : application.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{application.type.name}</p>
                                        </div>
                                        <p className="flex-1 truncate text-sm text-gray-500 dark:text-gray-400">{application.description}</p>
                                    </div>
                                    <Button variant="secondary" size="sm" onClick={() => router.visit(route('applications.show', application.id))}>
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <EmptyState message="No applications found. Try adjusting your search or filter to find what you're looking for." />
                )}

                {/* Loader for infinite scroll */}
                {applications.next_page_url && (
                    <div ref={loaderRef} className="mt-6 flex items-center justify-center py-6">
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                                <span className="text-sm text-gray-500">Loading more...</span>
                            </div>
                        ) : (
                            <div className="h-10" />
                        )}
                    </div>
                )}

                {/* No more applications message */}
                {!applications.next_page_url && applications.data.length > 0 && (
                    <div className="mt-6 py-6 text-center">
                        <p className="text-sm text-gray-500">No more applications to load</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
