<?php

declare(strict_types=1);

namespace App\Http\Actions\ApplicationKeys;

use App\Models\ApplicationKey;

final class UpdateAPIKeyAction
{
    /**
     * Update an application key.
     */
    public function handle(ApplicationKey $applicationKey, array $data): ApplicationKey
    {
        $applicationKey->update($data);

        return $applicationKey;
    }
}
