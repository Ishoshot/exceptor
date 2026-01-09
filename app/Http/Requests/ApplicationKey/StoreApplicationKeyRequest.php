<?php

declare(strict_types=1);

namespace App\Http\Requests\ApplicationKey;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Validator;

final class StoreApplicationKeyRequest extends FormRequest
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
            'name' => ['required', 'string', 'min:3', 'max:20', 'unique:application_keys,name,NULL,id,user_id,'.auth()->id()],
            'expires_at' => ['nullable', 'date', 'after:now'],
        ];
    }

    /**
     * Handle the validation after the request.
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->any()) {
                    return;
                }

                if ($this->user()->applicationKeys()->count() >= 5) {
                    session()->flash('error', 'You can only have a maximum of 5 API keys.');
                }
            },
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'key' => Str::random(64),
            'is_enabled' => true,
            'user_id' => $this->user()->id,
        ]);
    }
}
