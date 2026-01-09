import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ApplicationType } from '@/types';
import { router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { Filter, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface FilterOptions {
    search?: string;
    type?: string;
    sortBy?: 'name' | 'created_at' | 'updated_at';
    sortDirection?: 'asc' | 'desc';
}

interface ApplicationFilterProps {
    applicationTypes: ApplicationType[];
    initialFilters?: FilterOptions;
    onFilterChange?: (filters: FilterOptions) => void;
    className?: string;
    showSortOptions?: boolean;
}

export default function ApplicationFilter({
    applicationTypes,
    initialFilters = {},
    onFilterChange,
    className = '',
    showSortOptions = true,
}: ApplicationFilterProps) {
    const [filters, setFilters] = useState<FilterOptions>(initialFilters);
    const [searchInput, setSearchInput] = useState(initialFilters.search || '');
    const [isOpen, setIsOpen] = useState(false);
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    // Count active filters
    useEffect(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.type && filters.type !== '_all') count++;
        if (filters.sortBy && filters.sortBy !== 'created_at') count++;
        if (filters.sortDirection && filters.sortDirection !== 'desc') count++;
        setActiveFiltersCount(count);
    }, [filters]);

    // Initialize search input from filters
    useEffect(() => {
        setSearchInput(initialFilters.search || '');
    }, [initialFilters.search]);

    // Initialize filters
    useEffect(() => {
        const initialProcessedFilters = { ...initialFilters };
        // Convert empty type to "_all" for the UI
        if (initialProcessedFilters.type === '') {
            initialProcessedFilters.type = '_all';
        }
        setFilters(initialProcessedFilters);
    }, [initialFilters]);

    // Handle filter changes with debounce for search
    const debouncedSearch = useRef(
        debounce((value: string) => {
            handleFilterChange({ ...filters, search: value });
        }, 300),
    ).current;

    // Clean up debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleFilterChange = (newFilters: FilterOptions) => {
        // Convert "_all" value to empty string for the backend
        const processedFilters = { ...newFilters };
        if (processedFilters.type === '_all') {
            processedFilters.type = '';
        }

        setFilters(processedFilters);

        if (onFilterChange) {
            onFilterChange(processedFilters);
        } else {
            // Default behavior: update URL with query params
            const queryParams: Record<string, any> = { ...processedFilters, page: 1 };
            // Remove empty values from query params
            Object.keys(queryParams).forEach((key) => {
                if (queryParams[key] === '' || queryParams[key] === undefined) {
                    delete queryParams[key];
                }
            });

            router.get(window.location.pathname, queryParams, {
                preserveState: true,
                replace: true,
                only: ['applications'],
            });
        }
    };

    const resetFilters = () => {
        // Create default filters
        const resetFilters: FilterOptions = {
            search: '',
            type: '_all',
            sortBy: 'created_at',
            sortDirection: 'desc',
        };

        // Update UI state
        setSearchInput('');
        setFilters(resetFilters);

        // Close the popover
        setIsOpen(false);

        if (onFilterChange) {
            // Convert _all to empty string for backend
            const backendFilters = { ...resetFilters };
            if (backendFilters.type === '_all') {
                backendFilters.type = '';
            }
            onFilterChange(backendFilters);
        } else {
            // Default behavior: reset URL params and reload
            router.visit(window.location.pathname, {
                data: {}, // Empty data for POST
                preserveState: true,
                replace: true,
                only: ['applications'],
            });
        }
    };

    const clearSearch = () => {
        setSearchInput('');
        handleFilterChange({ ...filters, search: '' });
    };

    return (
        <div className={cn('flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4', className)}>
            {/* Search input */}
            <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                    placeholder="Search applications..."
                    className="pr-10 pl-10"
                    value={searchInput}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearchInput(value);
                        debouncedSearch(value);
                    }}
                />
                {searchInput && (
                    <button onClick={clearSearch} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Filter popover */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                        {activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-xs">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-80 rounded-md border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900"
                    align="end"
                    sideOffset={8}
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Application Type</h4>
                            <Select value={filters.type || '_all'} onValueChange={(value) => handleFilterChange({ ...filters, type: value })}>
                                <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-800">
                                    <SelectItem value="_all">All types</SelectItem>
                                    {applicationTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.slug}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {showSortOptions && (
                            <>
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Sort By</h4>
                                    <Select
                                        value={filters.sortBy || 'created_at'}
                                        onValueChange={(value: 'name' | 'created_at' | 'updated_at') =>
                                            handleFilterChange({
                                                ...filters,
                                                sortBy: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-800">
                                            <SelectItem value="name">Name</SelectItem>
                                            <SelectItem value="created_at">Date Created</SelectItem>
                                            <SelectItem value="updated_at">Last Updated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Sort Direction</h4>
                                    <Select
                                        value={filters.sortDirection || 'desc'}
                                        onValueChange={(value: 'asc' | 'desc') =>
                                            handleFilterChange({
                                                ...filters,
                                                sortDirection: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-gray-800">
                                            <SelectItem value="asc">Ascending</SelectItem>
                                            <SelectItem value="desc">Descending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        <div className="flex justify-between pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                                className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                            >
                                Reset filters
                            </Button>
                            <Button size="sm" onClick={() => setIsOpen(false)}>
                                Apply
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
