<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ExceptionOccurrence extends Model
{
    use HasFactory;
    use HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'application_exception_id',
        'request_data',
        'user_data',
        'environment_data',
        'breadcrumbs',
        'metadata',
        'occurred_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'request_data' => AsArrayObject::class,
        'user_data' => AsArrayObject::class,
        'environment_data' => AsArrayObject::class,
        'breadcrumbs' => AsCollection::class,
        'metadata' => AsArrayObject::class,
        'occurred_at' => 'datetime',
    ];

    /**
     * Get the exception that owns this occurrence.
     */
    public function exception(): BelongsTo
    {
        return $this->belongsTo(ApplicationException::class, 'application_exception_id');
    }

    /**
     * Scope a query to only include occurrences within a specific time range.
     */
    public function scopeOccurredBetween(Builder $query, string $startDate, string $endDate): Builder
    {
        return $query->whereBetween('occurred_at', [$startDate, $endDate]);
    }

    /**
     * Scope a query to only include occurrences for a specific exception.
     */
    public function scopeForException(Builder $query, string $exceptionId): Builder
    {
        return $query->where('application_exception_id', $exceptionId);
    }

    /**
     * Get the URL that was being accessed when the exception occurred.
     */
    public function getUrl(): ?string
    {
        if (! isset($this->request_data['url'])) {
            return null;
        }

        return $this->request_data['url'];
    }

    /**
     * Get the HTTP method that was being used when the exception occurred.
     */
    public function getMethod(): ?string
    {
        if (! isset($this->request_data['method'])) {
            return null;
        }

        return $this->request_data['method'];
    }

    /**
     * Get the user ID associated with this occurrence, if available.
     */
    public function getUserId(): ?string
    {
        if (! isset($this->user_data['id'])) {
            return null;
        }

        return $this->user_data['id'];
    }

    /**
     * Get the user email associated with this occurrence, if available.
     */
    public function getUserEmail(): ?string
    {
        if (! isset($this->user_data['email'])) {
            return null;
        }

        return $this->user_data['email'];
    }

    /**
     * Get the PHP version from the environment data.
     */
    public function getPhpVersion(): ?string
    {
        if (! isset($this->environment_data['php_version'])) {
            return null;
        }

        return $this->environment_data['php_version'];
    }

    /**
     * Get the Laravel version from the environment data.
     */
    public function getLaravelVersion(): ?string
    {
        if (! isset($this->environment_data['framework_version'])) {
            return null;
        }

        return $this->environment_data['framework_version'];
    }
}
