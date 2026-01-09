import { EmptyState } from '@/components/empty-state';
import ExceptionFilter, { FilterOptions } from '@/components/exception/exception-filter';
import ExceptionTable from '@/components/exception/exception-table';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { Exception, PaginatedData, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Exceptions',
        href: '/exceptions',
    },
];

interface Props {
    exceptions: PaginatedData<Exception>;
    filters?: FilterOptions;
}

export default function Exceptions({ exceptions: initialExceptions, filters = {} }: Props) {
    const [currentFilters, setCurrentFilters] = useState<FilterOptions>(filters);
    const [sortColumn, setSortColumn] = useState<string>('last_seen_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Handle filter changes
    const handleFilterChange = (newFilters: FilterOptions) => {
        setCurrentFilters(newFilters);

        // Update the URL with the new filters
        router.get(
            route('exceptions.search'),
            { ...newFilters, sort: sortColumn, direction: sortDirection },
            {
                preserveState: true,
                replace: true,
                only: ['exceptions'],
            },
        );
    };

    // Handle sorting
    const handleSort = (column: string) => {
        const newDirection = sortColumn === column && sortDirection === 'desc' ? 'asc' : 'desc';
        setSortColumn(column);
        setSortDirection(newDirection);

        router.get(
            route('exceptions.search'),
            { ...currentFilters, sort: column, direction: newDirection },
            {
                preserveState: true,
                replace: true,
                only: ['exceptions'],
            },
        );
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        router.get(
            route('exceptions.search'),
            { ...currentFilters, page, sort: sortColumn, direction: sortDirection },
            {
                preserveState: true,
                replace: true,
                only: ['exceptions'],
            },
        );
    };

    // Toggle view mode (for future implementation)
    const toggleViewMode = () => {
        // This would toggle between table and card view
        // For now, we're just implementing the table view
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exceptions" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl px-4 py-6 sm:px-6 lg:px-8">
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Exceptions</h2>
                            <div className="flex items-center rounded-md bg-gray-100 p-1 dark:bg-gray-800">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center space-x-1 px-2 py-1 text-xs"
                                    onClick={() => handleSort(sortColumn)}
                                >
                                    {sortDirection === 'desc' ? (
                                        <FaSortAmountDown className="mr-1 h-3 w-3" />
                                    ) : (
                                        <FaSortAmountUp className="mr-1 h-3 w-3" />
                                    )}
                                    <span>{sortDirection === 'desc' ? 'Newest' : 'Oldest'} first</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Component */}
                    <ExceptionFilter initialFilters={filters} onFilterChange={handleFilterChange} className="mb-6" />

                    {initialExceptions.data.length > 0 ? (
                        <>
                            <ExceptionTable
                                exceptions={initialExceptions.data}
                                onSort={handleSort}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                            />

                            {/* Pagination */}
                            {initialExceptions.last_page > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <Pagination
                                        currentPage={initialExceptions.current_page}
                                        totalPages={initialExceptions.last_page}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div>
                            <EmptyState message="No exceptions found matching your filters." />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
