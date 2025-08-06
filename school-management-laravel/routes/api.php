<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;

use Illuminate\Support\Facades\Route;

Route::post('/login', [Authcontroller::class, 'login']);

Route::get('/me', [Authcontroller::class,'me'])->middleware(['auth:api','role:admin']);

Route::middleware(['auth:api','role:admin'])->prefix('admin')->group(function(){
    Route::apiResource('/teachers',TeacherController::class);
    Route::apiResource('/students', StudentController::class);
});

