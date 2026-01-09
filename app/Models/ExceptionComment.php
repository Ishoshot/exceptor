<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class ExceptionComment extends Model
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
        'user_id',
        'content',
        'metadata',
        'is_internal',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'metadata' => AsArrayObject::class,
        'is_internal' => 'boolean',
    ];

    /**
     * Get the exception that owns the comment.
     */
    public function exception(): BelongsTo
    {
        return $this->belongsTo(ApplicationException::class, 'application_exception_id');
    }

    /**
     * Get the user that created the comment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include comments for a specific exception.
     */
    public function scopeForException(Builder $query, string $exceptionId): Builder
    {
        return $query->where('application_exception_id', $exceptionId);
    }

    /**
     * Scope a query to only include comments by a specific user.
     */
    public function scopeByUser(Builder $query, string $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include internal comments.
     */
    public function scopeInternal(Builder $query): Builder
    {
        return $query->where('is_internal', true);
    }

    /**
     * Scope a query to only include public comments.
     */
    public function scopePublic(Builder $query): Builder
    {
        return $query->where('is_internal', false);
    }

    /**
     * Scope a query to search for comments by content.
     */
    public function scopeSearch(Builder $query, string $searchTerm): Builder
    {
        return $query->where('content', 'ILIKE', "%{$searchTerm}%");
    }

    /**
     * Generate a factory for this model.
     */
    protected static function newFactory()
    {
        return \Database\Factories\ExceptionCommentFactory::new();
    }
}
