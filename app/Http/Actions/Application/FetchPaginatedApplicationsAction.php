<?php

declare(strict_types=1);

namespace App\Http\Actions\Application;

use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        return $this->buildQuery($authenticatable, $filters)->paginate($perPage)->withQueryString();
    }

    /**
     * Build the query with filters.
     *
     * @param  array<string, mixed>  $filters
     */
    private function buildQuery(Authenticatable $authenticatable, array $filters): HasMany
    {
        // Type cast to User to access the applications relationship
        $authenticatable = $authenticatable instanceof User ? $authenticatable : User::find($authenticatable->getAuthIdentifier());

        if (! $authenticatable) {
            abort(403, 'User not found');
        }

        $query = $authenticatable->applications()->with('type');

        // Apply search filter
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', sprintf('%%%s%%', $search))
                    ->orWhere('description', 'like', sprintf('%%%s%%', $search));
            });
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

        // Validate sort parameters
        $validSortFields = ['name', 'created_at', 'updated_at'];
        $sortBy = in_array($sortBy, $validSortFields) ? $sortBy : 'created_at';
        $sortDirection = in_array($sortDirection, ['asc', 'desc']) ? $sortDirection : 'desc';

        $query->orderBy($sortBy, $sortDirection);

        return $query;
    }
}
