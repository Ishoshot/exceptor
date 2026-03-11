<?php

declare(strict_types=1);

namespace App\Http\Actions\Application;

use App\Models\Application;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

final class FetchApplicationsAction
{
    /**
     * Fetch applications with filters.
     *
     * @param  array<string, mixed>  $filters
     * @return Collection<int, Application>
     */
    public function handle(array $filters): Collection
    {
        return $this->buildQuery($filters)->get();
    }

    /**
     * Build the query with filters.
     *
     * @param  array<string, mixed>  $filters
     */
    private function buildQuery(array $filters): Builder
    {
        $builder = Application::with('type')
            ->when(isset($filters['user_id']) && $filters['user_id'], fn ($query) => $query->where('user_id', $filters['user_id']))
            ->latest();

        // Apply search filter
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $builder->whereRaw("name LIKE '%{$search}%' OR description LIKE '%{$search}%'");
        }

        // Apply type filter
        if (! empty($filters['type'])) {
            $type = $filters['type'];
            $builder->whereHas('type', function ($q) use ($type): void {
                $q->where('slug', $type);
            });
        }

        // Apply sorting
        $sortBy = $filters['sortBy'] ?? 'created_at';
        $sortDirection = $filters['sortDirection'] ?? 'desc';

        $builder->orderBy($sortBy, $sortDirection);

        return $builder;
    }
}
