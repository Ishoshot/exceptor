<?php

declare(strict_types=1);

use App\Http\Controllers\Api\WebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Webhook endpoint for receiving exception data from Laravel applications
Route::post('/webhook/{applicationId}/{hash}', [WebhookController::class, 'handle'])
    ->name('webhook.handle');
