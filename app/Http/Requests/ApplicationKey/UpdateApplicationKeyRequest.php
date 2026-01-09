<?php

declare(strict_types=1);

namespace App\Http\Requests\ApplicationKey;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

final class UpdateApplicationKeyRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'expires_at' => ['nullable', 'date', 'after:now'],
            'is_enabled' => ['boolean'],
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

                if ($this->user()->id !== $this->applicationKey->user_id) {
                    session()->flash('error', 'You do not have permission to update this API key.');
                }
            },
        ];
    }
}
