<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\MessageController;

use Illuminate\Support\Facades\Route;

Route::post('/login', [Authcontroller::class, 'login']);

Route::get('/me', [Authcontroller::class, 'me'])->middleware(['auth:api']);

Route::middleware(['auth:api', 'role:admin'])->prefix('admin')->group(function () {
    Route::apiResource('/teachers', TeacherController::class);
    Route::apiResource('/students', StudentController::class);
});

Route::get('/teacher-student', [StudentController::class, 'index'])->middleware(['auth:api', 'role:teacher']);

Route::middleware('auth:api')->group(function () {
    Route::post('/messages', [MessageController::class, 'sendMessage']);
    Route::get('/messages/{userId}', [MessageController::class, 'getMessages']);
});

Route::get('/chat/users', [MessageController::class, 'getData'])->middleware(['auth:api']);


