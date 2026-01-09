<?php

declare(strict_types=1);

namespace App\Http\Requests\Exception;

use App\Enums\ExceptionEnvironment;
use App\Enums\ExceptionLevel;
use App\Enums\ExceptionSource;
use App\Enums\ExceptionStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

final class SearchExceptionsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'application_id' => 'nullable|string|exists:applications,id',
            'status' => ['nullable', new Enum(ExceptionStatus::class)],
            'level' => ['nullable', new Enum(ExceptionLevel::class)],
            'environment' => ['nullable', new Enum(ExceptionEnvironment::class)],
            'source' => ['nullable', new Enum(ExceptionSource::class)],
            'search' => 'nullable|string|max:255',
            'tag_id' => 'nullable|string|exists:exception_tags,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'sort_by' => 'nullable|string|in:last_seen_at,first_seen_at,occurrence_count',
            'sort_direction' => 'nullable|string|in:asc,desc',
            'per_page' => 'nullable|integer|min:10|max:100',
            'page' => 'nullable|integer|min:1',
        ];
    }

    /**
     * Get the default values for the request.
     *
     * @return array<string, mixed>
     */
    public function defaults(): array
    {
        return [
            'sort_by' => 'last_seen_at',
            'sort_direction' => 'desc',
            'per_page' => 25,
            'page' => 1,
        ];
    }
}
