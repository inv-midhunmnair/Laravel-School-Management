<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [Authcontroller::class, 'login']);
Route::post('/refresh', [Authcontroller::class, 'refresh']);

Route::middleware(['auth:api'])->group(function () {
    Route::get('/me', [Authcontroller::class, 'me']);
});

