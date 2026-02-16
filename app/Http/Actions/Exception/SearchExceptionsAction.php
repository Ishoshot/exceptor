<?php

declare(strict_types=1);

namespace App\Http\Actions\Exception;

use App\Http\Requests\Exception\SearchExceptionsRequest;
use App\Models\ApplicationException;
use Illuminate\Pagination\LengthAwarePaginator;

final class SearchExceptionsAction
{
    /**
     * Search and filter exceptions.
     */
    public function handle(SearchExceptionsRequest $request): LengthAwarePaginator
    {
        $data = $request->validated();
        $defaults = $request->defaults();

        $query = ApplicationException::query();

        // Filter by application
        if (isset($data['application_id'])) {
            $query->where('application_id', $data['application_id']);
        }

        // Filter by status
        if (isset($data['status'])) {
            $query->whereStatus($data['status']);
        }

        // Filter by level
        if (isset($data['level'])) {
            $query->whereLevel($data['level']);
        }

        // Filter by environment
        if (isset($data['environment'])) {
            $query->whereEnvironment($data['environment']);
        }

        // Filter by source
        if (isset($data['source'])) {
            $query->whereSource($data['source']);
        }

        // Filter by search term
        if (isset($data['search']) && $data['search']) {
            $search = $request->input('search');
            $query->whereRaw("title LIKE '%{$search}%' OR message LIKE '%{$search}%'");
        }

        // Filter by tag
        if (isset($data['tag_id'])) {
            $query->whereHas('tags', function ($q) use ($data): void {
                $q->where('exception_tags.id', $data['tag_id']);
            });
        }

        // Filter by date range
        if (isset($data['start_date'])) {
            $query->whereDate('first_seen_at', '>=', $data['start_date']);
        }

        if (isset($data['end_date'])) {
            $query->whereDate('last_seen_at', '<=', $data['end_date']);
        }

        // Apply sorting
        $sortBy = $request->input('sort_by', $defaults['sort_by']);
        $sortDirection = $request->input('sort_direction', $defaults['sort_direction']);
        $query->orderBy($sortBy, $sortDirection);

        // Apply pagination
        $perPage = (int) $request->input('per_page', 500);

        return $query->with(['tags', 'application'])
            ->withCount('occurrences')
            ->withCount('comments')
            ->paginate($perPage);
    }
}
