<?php

declare(strict_types=1);

namespace App\Http\Actions\Application;

use App\Models\Application;

final class CreateApplicationAction
{
    /**
     * Create a new application.
     *
     * @param  array<string, mixed>  $data
     */
    public function handle(array $data): Application
    {
        return Application::create($data);
    }
}
