<?php

declare(strict_types=1);

namespace App\Http\Controllers\Application;

use App\Http\Actions\ApplicationKeys\CreateAPIKeyAction;
use App\Http\Actions\ApplicationKeys\DeleteAPIKeyAction;
use App\Http\Actions\ApplicationKeys\UpdateAPIKeyAction;
use App\Http\Requests\ApplicationKey\DeleteApplicationKeyRequest;
use App\Http\Requests\ApplicationKey\StoreApplicationKeyRequest;
use App\Http\Requests\ApplicationKey\UpdateApplicationKeyRequest;
use App\Models\ApplicationKey;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ApplicationKeyController
{
    /**
     * Display a listing of the application keys.
     */
    public function index(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $applicationKeys = $user->applicationKeys()
            ->latest()
            ->get();

        $applicationKeys->makeVisible('key');

        return Inertia::render('settings/application-keys', [
            'applicationKeys' => $applicationKeys,
        ]);
    }

    /**
     * Store a newly created application key in storage.
     */
    public function store(StoreApplicationKeyRequest $storeApplicationKeyRequest, CreateAPIKeyAction $createAPIKeyAction): RedirectResponse
    {

        $createAPIKeyAction->handle($storeApplicationKeyRequest->all());

        return back()->with(['success' => sprintf('API key - %s created successfully.', $storeApplicationKeyRequest->name)]);
    }

    /**
     * Update the specified application key in storage.
     */
    public function update(UpdateApplicationKeyRequest $updateApplicationKeyRequest, ApplicationKey $applicationKey, UpdateAPIKeyAction $updateAPIKeyAction): RedirectResponse
    {

        $updateAPIKeyAction->handle($applicationKey, $updateApplicationKeyRequest->all());

        return back()->with(['success' => sprintf('API key - %s updated successfully.', $updateApplicationKeyRequest->name)]);
    }

    /**
     * Remove the specified application key from storage.
     */
    public function destroy(DeleteApplicationKeyRequest $deleteApplicationKeyRequest, ApplicationKey $applicationKey, DeleteAPIKeyAction $deleteAPIKeyAction): RedirectResponse
    {

        $deleteAPIKeyAction->handle($applicationKey);

        return back()->with(['success' => sprintf('API key - %s deleted successfully.', $applicationKey->name)]);
    }
}
