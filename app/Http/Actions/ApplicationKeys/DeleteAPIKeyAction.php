<?php

declare(strict_types=1);

namespace App\Http\Actions\ApplicationKeys;

use App\Models\ApplicationKey;

final class DeleteAPIKeyAction
{
    /**
     * Delete an application key.
     */
    public function handle(ApplicationKey $applicationKey): void
    {
        $applicationKey->delete();
    }
}
