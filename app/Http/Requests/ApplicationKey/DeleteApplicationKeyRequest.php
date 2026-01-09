<?php

declare(strict_types=1);

namespace App\Http\Requests\ApplicationKey;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

final class DeleteApplicationKeyRequest extends FormRequest
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
                    session()->flash('error', 'You do not have permission to delete this API key.');
                }
            },
        ];
    }
}
