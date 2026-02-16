<?php

declare(strict_types=1);

namespace App\Http\Requests\Application;

use Illuminate\Foundation\Http\FormRequest;

final class FilterApplicationRequest extends FormRequest
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
            'search' => 'nullable|string',
            'type' => 'nullable|string',
            'sortBy' => 'nullable|string|in:name,created_at,updated_at',
            'sortDirection' => 'nullable|string|in:asc,desc',
            'hasWebhook' => 'nullable|boolean',
            'perPage' => 'nullable|integer|min:5|max:100',
        ];
    }

    /**
     * Get the validated filter parameters.
     *
     * @return array<string, mixed>
     */
    public function filters(): array
    {
        return [
            'search' => $this->input('search'),
            'type' => $this->input('type'),
            'sortBy' => $this->input('sortBy', 'created_at'),
            'sortDirection' => $this->input('sortDirection', 'desc'),
            'hasWebhook' => $this->has('hasWebhook') ? $this->boolean('hasWebhook') : null,
            'perPage' => (int) $this->input('perPage', 15),
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'sortBy' => $this->input('sortBy', 'created_at'),
            'sortDirection' => $this->input('sortDirection', 'desc'),
            'perPage' => $this->input('perPage', 15),
            'user_id' => auth()->id(),
        ]);
    }
}
