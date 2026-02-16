<?php

declare(strict_types=1);

namespace App\Http\Actions\Application;

use App\Models\Application;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

final class FetchPaginatedApplicationsAction
{
    /**
     * Fetch paginated applications with filters.
     *
     * @param  array<string, mixed>  $filters
     */
    public function handle(Authenticatable $authenticatable, array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $requestedPerPage = isset($filters['per_page']) ? (int) $filters['per_page'] : $perPage;

        return $this->buildQuery($authenticatable, $filters)->paginate($requestedPerPage)->withQueryString();
    }

    /**
     * Build the query with filters.
     *
     * @param  array<string, mixed>  $filters
     */
    private function buildQuery(Authenticatable $authenticatable, array $filters): Builder
    {
        $authenticatable = $authenticatable instanceof User ? $authenticatable : User::find($authenticatable->getAuthIdentifier());

        if (! $authenticatable) {
            abort(403, 'User not found');
        }

        $query = Application::query()->with('type');

        // Apply search filter
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->whereRaw("name LIKE '%{$search}%' OR description LIKE '%{$search}%'");
        }

        // Apply type filter
        if (! empty($filters['type'])) {
            $type = $filters['type'];
            $query->whereHas('type', function ($q) use ($type): void {
                $q->where('slug', $type);
            });
        }

        // Apply sorting
        $sortBy = $filters['sortBy'] ?? 'created_at';
        $sortDirection = $filters['sortDirection'] ?? 'desc';

        $query->orderBy($sortBy, $sortDirection);

        return $query;
    }
}
