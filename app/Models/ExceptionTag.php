<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class ExceptionTag extends Model
{
    use HasFactory;
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'application_id',
        'name',
        'color',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [];

    /**
     * Get the application that owns the tag.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Get the exceptions that are tagged with this tag.
     */
    public function exceptions(): BelongsToMany
    {
        return $this->belongsToMany(
            ApplicationException::class,
            'application_exception_tag',
            'exception_tag_id',
            'application_exception_id'
        )->withTimestamps();
    }

    /**
     * Scope a query to only include tags for a specific application.
     */
    public function scopeForApplication(Builder $query, string $applicationId): Builder
    {
        return $query->where('application_id', $applicationId);
    }

    /**
     * Scope a query to search for tags by name or description.
     */
    public function scopeSearch(Builder $query, string $searchTerm): Builder
    {
        return $query->whereAny([
            'name',
            'description',
        ], 'ILIKE', "%{$searchTerm}%");
    }

    /**
     * Get the count of exceptions with this tag.
     */
    public function getExceptionCount(): int
    {
        return $this->exceptions()->count();
    }

    /**
     * Get the count of unresolved exceptions with this tag.
     */
    public function getUnresolvedExceptionCount(): int
    {
        return $this->exceptions()->unresolved()->count();
    }

    /**
     * Generate a factory for this model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\ExceptionTagFactory::new();
    }
}
