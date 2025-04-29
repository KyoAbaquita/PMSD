<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
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





Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // User profile route
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });

    // Project routes
    Route::apiResource('projects', \App\Http\Controllers\ProjectController::class);

    // Task routes
    Route::apiResource('tasks', \App\Http\Controllers\TaskController::class);

    // Get tasks for a specific project
    Route::get('projects/{project}/tasks', [\App\Http\Controllers\TaskController::class, 'getProjectTasks']);

    // Get all users for task assignment
    Route::get('/users', function () {
        return response()->json(['users' => \App\Models\User::all()]);
    });
});
