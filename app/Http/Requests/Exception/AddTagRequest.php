<?php

declare(strict_types=1);

namespace App\Http\Requests\Exception;

use Illuminate\Foundation\Http\FormRequest;

final class AddTagRequest extends FormRequest
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
            'tag_id' => 'required_without:tag_name|string|exists:exception_tags,id',
            'tag_name' => 'required_without:tag_id|string|max:50',
            'color' => 'required_with:tag_name|string|max:20',
            'description' => 'nullable|string|max:255',
        ];
    }
}
