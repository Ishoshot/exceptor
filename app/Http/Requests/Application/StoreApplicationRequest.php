<?php

declare(strict_types=1);

namespace App\Http\Requests\Application;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

final class StoreApplicationRequest extends FormRequest
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
            'application_type_id' => 'required|string|exists:application_types,id',
            'name' => 'required|string',
            'description' => 'required|string|min:10|max:255',
            'url' => 'nullable|string|url',
            'repository' => 'nullable|string|url',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->name.'-'.$this->application_type_id.str()->random(4)),
            'user_id' => auth()->user()->id,
        ]);
    }
}
