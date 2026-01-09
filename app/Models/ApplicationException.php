<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ExceptionEnvironment;
use App\Enums\ExceptionLevel;
use App\Enums\ExceptionSource;
use App\Enums\ExceptionStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class ApplicationException extends Model
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
        'exception_class',
        'message',
        'file',
        'line',
        'fingerprint',
        'level',
        'status',
        'environment',
        'source',
        'code',
        'occurrence_count',
        'first_seen_at',
        'last_seen_at',
        'resolved_at',
        'trace',
        'trace_formatted',
        'request_data',
        'user_data',
        'environment_data',
        'breadcrumbs',
        'previous_exception',
        'metadata',
        'tags',
        'notes',
        'resolved_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'level' => ExceptionLevel::class,
        'status' => ExceptionStatus::class,
        'environment' => ExceptionEnvironment::class,
        'source' => ExceptionSource::class,
        'line' => 'integer',
        'code' => 'integer',
        'occurrence_count' => 'integer',
        'first_seen_at' => 'datetime',
        'last_seen_at' => 'datetime',
        'resolved_at' => 'datetime',
        'request_data' => AsArrayObject::class,
        'user_data' => AsArrayObject::class,
        'environment_data' => AsArrayObject::class,
        'breadcrumbs' => AsCollection::class,
        'previous_exception' => AsArrayObject::class,
        'metadata' => AsArrayObject::class,
        'trace_formatted' => AsCollection::class,
    ];

    /**
     * Get the application that owns the application exception.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Get the user who resolved the exception.
     */
    public function resolvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    /**
     * Get the occurrences of this exception.
     */
    public function occurrences(): HasMany
    {
        return $this->hasMany(ExceptionOccurrence::class);
    }

    /**
     * Get the tags associated with this exception.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(
            ExceptionTag::class,
            'application_exception_tag',
            'application_exception_id',
            'exception_tag_id'
        )->withTimestamps();
    }

    /**
     * Get the comments for this exception.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(ExceptionComment::class, 'application_exception_id');
    }

    /**
     * Get the public comments for this exception.
     */
    public function publicComments(): HasMany
    {
        return $this->comments()->public();
    }

    /**
     * Get the internal comments for this exception.
     */
    public function internalComments(): HasMany
    {
        return $this->comments()->internal();
    }

    /**
     * Scope a query to only include exceptions with a specific status.
     */
    public function scopeWithStatus(Builder $query, ExceptionStatus $status): Builder
    {
        return $query->where('status', $status->value);
    }

    /**
     * Scope a query to only include exceptions with a specific level or higher.
     */
    public function scopeWithLevelOrHigher(Builder $query, ExceptionLevel $level): Builder
    {
        $severityLevels = array_filter(
            ExceptionLevel::values(),
            fn (string $value): bool => ExceptionLevel::from($value)->severity() >= $level->severity()
        );

        return $query->whereIn('level', $severityLevels);
    }

    /**
     * Scope a query to only include exceptions from a specific environment.
     */
    public function scopeFromEnvironment(Builder $query, ExceptionEnvironment $environment): Builder
    {
        return $query->where('environment', $environment->value);
    }

    /**
     * Scope a query to only include exceptions from a specific source.
     */
    public function scopeFromSource(Builder $query, ExceptionSource $source): Builder
    {
        return $query->where('source', $source->value);
    }

    /**
     * Scope a query to only include unresolved exceptions.
     */
    public function scopeUnresolved(Builder $query): Builder
    {
        return $query->where('status', ExceptionStatus::Unresolved->value);
    }

    /**
     * Scope a query to only include resolved exceptions.
     */
    public function scopeResolved(Builder $query): Builder
    {
        return $query->where('status', ExceptionStatus::Resolved->value);
    }

    /**
     * Scope a query to only include exceptions that occurred within a specific time range.
     */
    public function scopeOccurredBetween(Builder $query, string $startDate, string $endDate): Builder
    {
        return $query->whereBetween('last_seen_at', [$startDate, $endDate]);
    }

    /**
     * Scope a query to search for exceptions by message or class.
     */
    public function scopeSearch(Builder $query, string $searchTerm): Builder
    {
        return $query->whereAny([
            'message',
            'exception_class',
            'file',
        ], 'ILIKE', "%{$searchTerm}%");
    }

    /**
     * Mark the exception as resolved.
     */
    public function markAsResolved(?string $userId = null): self
    {
        $this->update([
            'status' => ExceptionStatus::Resolved,
            'resolved_at' => now(),
            'resolved_by' => $userId,
        ]);

        return $this;
    }

    /**
     * Mark the exception as unresolved.
     */
    public function markAsUnresolved(): self
    {
        $this->update([
            'status' => ExceptionStatus::Unresolved,
            'resolved_at' => null,
            'resolved_by' => null,
        ]);

        return $this;
    }

    /**
     * Mark the exception as muted.
     */
    public function markAsMuted(): self
    {
        $this->update([
            'status' => ExceptionStatus::Muted,
        ]);

        return $this;
    }

    /**
     * Increment the occurrence count.
     */
    public function incrementOccurrenceCount(): self
    {
        $this->update([
            'occurrence_count' => $this->occurrence_count + 1,
            'last_seen_at' => now(),
        ]);

        return $this;
    }

    /**
     * Get the formatted trace.
     */
    public function getFormattedTrace(): array
    {
        return json_decode($this->trace, true) ?: [];
    }

    /**
     * Get the exception title (first line of the message).
     */
    public function getTitle(): string
    {
        $message = $this->message ?? '';
        $firstLine = strtok($message, "\n");

        return $firstLine ?: 'Unknown Exception';
    }

    /**
     * Get the exception summary.
     */
    public function getSummary(): string
    {
        return sprintf(
            '%s: %s in %s line %d',
            $this->exception_class,
            $this->getTitle(),
            $this->file,
            $this->line
        );
    }
}
