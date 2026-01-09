<?php

declare(strict_types=1);

namespace App\Http\Actions\ApplicationKeys;

use App\Models\ApplicationKey;

final class CreateAPIKeyAction
{
    /**
     * Create a new application key.
     */
    public function handle(array $data): ApplicationKey
    {
        return ApplicationKey::create($data);
    }
}
