<?php

declare(strict_types=1);

use App\Http\Controllers\Exception\CommentController;
use App\Http\Controllers\Exception\ExceptionController;
use App\Http\Controllers\Exception\ExceptionOccurrenceController;
use App\Http\Controllers\Exception\SearchController;
use App\Http\Controllers\Exception\StatusController;
use App\Http\Controllers\Exception\TagController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {

    // Exception search and filter - must be defined before the wildcard route
    Route::get('exceptions/search', [SearchController::class, 'index'])->name('exceptions.search');

    // Exception listing and details
    Route::get('exceptions', [ExceptionController::class, 'index'])->name('exceptions.index');

    Route::get('exceptions/{exception}', [ExceptionController::class, 'show'])->name('exceptions.show');

    // Exception occurrence details
    Route::get('exceptions/{exception}/occurrences/{occurrence}', [ExceptionOccurrenceController::class, 'show'])->name('exceptions.occurrences.show');

    // Exception status management
    Route::post('exceptions/{exception}/status', [StatusController::class, 'update'])->name('exceptions.status.update');

    // Exception tag management
    Route::post('exceptions/{exception}/tags', [TagController::class, 'add'])->name('exceptions.tags.add');

    Route::delete('exceptions/{exception}/tags', [TagController::class, 'remove'])->name('exceptions.tags.remove');

    // Exception comment management
    Route::post('exceptions/{exception}/comments', [CommentController::class, 'store'])->name('exceptions.comments.store');

    Route::delete('exceptions/{exception}/comments/{comment}', [CommentController::class, 'destroy'])->name('exceptions.comments.destroy');
});
