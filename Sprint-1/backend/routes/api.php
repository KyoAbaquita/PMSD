<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\api\TaskController;
use App\Http\Controllers\api\ProjectController;
use App\Http\Controllers\api\TaskFileController;
use App\Http\Controllers\api\RiskIssueController;
use App\Http\Controllers\api\TaskCommentController;
use App\Http\Controllers\api\ProjectMemberController;
use App\Http\Controllers\api\ProjectExpenditureController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // Authenticated user profile
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });

    // Project routes
    Route::apiResource('projects', ProjectController::class);

    // Task routes
    Route::apiResource('tasks', TaskController::class);
    Route::get('projects/{project}/tasks', [TaskController::class, 'getProjectTasks']);

    // Task Comments routes
    Route::get('/tasks/{task}/comments', [TaskCommentController::class, 'index']);
    Route::post('/tasks/{task}/comments', [TaskCommentController::class, 'store']);

    // Task Files routes
    Route::get('/tasks/{task}/files', [TaskFileController::class, 'index']);
    Route::post('/tasks/{task}/files', [TaskFileController::class, 'store']);
    Route::get('/files/{file}/download', [TaskFileController::class, 'download']);
    Route::delete('/files/{file}', [TaskFileController::class, 'destroy']);

    // Project Members routes
    Route::get('projects/{project}/members', [ProjectMemberController::class, 'index']);
    Route::post('projects/{project}/members', [ProjectMemberController::class, 'store']);
    Route::delete('projects/{project}/members/{user}', [ProjectMemberController::class, 'destroy']);

    // Activity Log routes
    Route::get('/notifications', function () {
        return \App\Models\ActivityLog::where('user_id', auth()->id())
            ->with('user:id,name')
            ->latest()
            ->limit(20)
            ->get();
    });


    // Get all users (used for system-wide purposes if needed)
    Route::get('/users', function () {
        return response()->json(['users' => User::all()]);
    });
    // Expenditure routes
    Route::get('/projects/{project}/expenditures', [ProjectExpenditureController::class, 'index']);
    Route::post('/projects/{project}/expenditures', [ProjectExpenditureController::class, 'store']);
    Route::delete('/expenditures/{id}', [ProjectExpenditureController::class, 'destroy']);

    // Risk & Issue routes
    Route::get('/projects/{project}/risks-issues', [RiskIssueController::class, 'index']);
    Route::post('/projects/{project}/risks-issues', [RiskIssueController::class, 'store']);
    Route::get('/risks-issues/{riskIssue}', [RiskIssueController::class, 'show']);
    Route::put('/risks-issues/{riskIssue}', [RiskIssueController::class, 'update']);
    Route::delete('/risks-issues/{riskIssue}', [RiskIssueController::class, 'destroy']);


});
