<?php

declare(strict_types=1);

namespace App\Http\Actions\Exception;

use App\Http\Requests\Exception\AddTagRequest;
use App\Models\ApplicationException;
use App\Models\ExceptionTag;

final class AddExceptionTagAction
{
    /**
     * Add a tag to an exception.
     */
    public function handle(AddTagRequest $request, ApplicationException $exception): ApplicationException
    {
        $data = $request->validated();

        // If a tag ID is provided, attach the existing tag
        if (isset($data['tag_id'])) {
            $tag = ExceptionTag::findOrFail($data['tag_id']);
        } else {
            // Create a new tag if tag_name is provided
            $tag = ExceptionTag::create([
                'application_id' => $exception->application_id,
                'name' => $data['tag_name'],
                'color' => $data['color'] ?? '#6366F1', // Default to indigo if not provided
                'description' => $data['description'] ?? null,
            ]);
        }

        // Attach the tag to the exception if not already attached
        if (! $exception->tags()->where('exception_tags.id', $tag->id)->exists()) {
            $exception->tags()->attach($tag->id);
        }

        return $exception->refresh();
    }
}
