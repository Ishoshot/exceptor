<?php

declare(strict_types=1);

namespace App\Http\Requests\Exception;

use Illuminate\Foundation\Http\FormRequest;

final class DeleteCommentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $comment = $this->route('comment');

        // Only the comment author or an admin can delete a comment
        return $this->user() && ($this->user()->id === $comment->user_id || $this->user()->isAdmin());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [];
    }
}
