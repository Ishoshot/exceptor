import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ExceptionEnvironment, ExceptionLevel, ExceptionSource, ExceptionStatus } from '@/types';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export interface FilterOptions {
    search?: string;
    status?: ExceptionStatus;
    level?: ExceptionLevel;
    environment?: ExceptionEnvironment;
    source?: ExceptionSource;
    application_id?: string;
    tag_id?: string;
    start_date?: string;
    end_date?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
}

interface ExceptionFilterProps {
    initialFilters?: FilterOptions;
    onFilterChange: (filters: FilterOptions) => void;
    className?: string;
}

export default function ExceptionFilter({ initialFilters = {}, onFilterChange, className }: ExceptionFilterProps) {
    const [filters, setFilters] = useState<FilterOptions>(initialFilters);

    const handleFilterChange = (key: keyof FilterOptions, value: string | null) => {
        const newFilters = { ...filters, [key]: value === null || value === 'all' ? undefined : value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFilterChange('search', e.target.value || null);
    };

    const handleReset = () => {
        const resetFilters: FilterOptions = {};
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className={cn('space-y-4', className)}>
            <div className="flex flex-col gap-4 md:flex-row">
                {/* Search input */}
                <div className="relative flex-1">
                    <FaSearch className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search exceptions..."
                        className="pl-10"
                        value={filters.search || ''}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Status filter */}
                <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="unresolved">Unresolved</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="muted">Muted</SelectItem>
                        <SelectItem value="ignored">Ignored</SelectItem>
                    </SelectContent>
                </Select>

                {/* Level filter */}
                <Select value={filters.level || 'all'} onValueChange={(value) => handleFilterChange('level', value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="notice">Notice</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                </Select>

                {/* Environment filter */}
                <Select value={filters.environment || 'all'} onValueChange={(value) => handleFilterChange('environment', value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Environment" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Environments</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="local">Local</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
                {/* Source filter */}
                <Select value={filters.source || 'all'} onValueChange={(value) => handleFilterChange('source', value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="backend">Backend</SelectItem>
                        <SelectItem value="frontend">Frontend</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="third_party">Third Party</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                        <SelectItem value="queue">Queue</SelectItem>
                        <SelectItem value="console">Console</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort by filter */}
                <Select value={filters.sort_by || 'last_seen_at'} onValueChange={(value) => handleFilterChange('sort_by', value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="last_seen_at">Last Seen</SelectItem>
                        <SelectItem value="first_seen_at">First Seen</SelectItem>
                        <SelectItem value="occurrence_count">Occurrence Count</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort direction filter */}
                <Select
                    value={filters.sort_direction || 'desc'}
                    onValueChange={(value) => handleFilterChange('sort_direction', value as 'asc' | 'desc')}
                >
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Sort direction" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Descending</SelectItem>
                        <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                </Select>

                {/* Reset button */}
                <Button variant="outline" onClick={handleReset} className="md:ml-auto">
                    Reset Filters
                </Button>
            </div>
        </div>
    );
}
