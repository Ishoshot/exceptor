<?php

declare(strict_types=1);

use App\Http\Controllers\Application\ApplicationController;
use App\Http\Controllers\Application\Webhook\WebhookGenerationController;
use App\Http\Controllers\Application\Webhook\WebhookRateLimitController;
use App\Http\Controllers\Application\Webhook\WebhookRegenerationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {

    Route::get('applications', [ApplicationController::class, 'index'])->name('applications.index');
    Route::get('applications/all', [ApplicationController::class, 'all'])->name('applications.all');
    Route::get('applications/{application}', [ApplicationController::class, 'show'])->name('applications.show');
    Route::post('application', [ApplicationController::class, 'store'])->name('applications.store');

    // Webhook Routes
    Route::post('applications/{application}/webhook/generate', WebhookGenerationController::class)->name('applications.webhook.generate');
    Route::post('applications/{application}/webhook/regenerate', WebhookRegenerationController::class)->name('applications.webhook.regenerate');
    Route::post('applications/{application}/webhook/rate-limit', WebhookRateLimitController::class)->name('applications.webhook.rate-limit');
});
