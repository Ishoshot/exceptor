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
        $builder = Application::query()->with('type')
            ->when(isset($filters['user_id']) && $filters['user_id'], fn ($query) => $query->where('user_id', $filters['user_id']))
            ->latest();

        // Apply search filter
        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $builder->where(function ($q) use ($search): void {
                $q->where('name', 'like', sprintf('%%%s%%', $search))
                    ->orWhere('description', 'like', sprintf('%%%s%%', $search));
            });
        }

        // Apply type filter
        if (! empty($filters['type'])) {
            $type = $filters['type'];
            $builder->whereHas('type', function ($q) use ($type): void {
                $q->where('slug', $type);
            });
        }

        if (array_key_exists('hasWebhook', $filters) && is_bool($filters['hasWebhook'])) {
            if ($filters['hasWebhook']) {
                $builder->whereNotNull('webhook_url')->where('webhook_url', '!=', '');
            } else {
                $builder->where(function (Builder $query): void {
                    $query->whereNull('webhook_url')->orWhere('webhook_url', '');
                });
            }
        }

        // Apply sorting
        $sortBy = $filters['sortBy'] ?? 'created_at';
        $sortDirection = $filters['sortDirection'] ?? 'desc';

        // Validate sort parameters
        $validSortFields = ['name', 'created_at', 'updated_at'];
        $sortBy = in_array($sortBy, $validSortFields, true) ? $sortBy : 'created_at';
        $sortDirection = in_array($sortDirection, ['asc', 'desc'], true) ? $sortDirection : 'desc';

        $builder->orderBy($sortBy, $sortDirection);

        return $builder;
    }
}
