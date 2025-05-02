<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskCommentController extends Controller
{
    public function index(Task $task)
    {
        return response()->json([
            'comments' => $task->comments()->with('user:id,name')->latest()->get(),
        ]);
    }

    public function store(Request $request, Task $task)
    {
        $request->validate([
            'comment' => 'required|string|max:1000',
        ]);

        $comment = TaskComment::create([
            'task_id' => $task->id,
            'user_id' => Auth::id(),
            'comment' => $request->comment,
        ]);

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $comment->load('user:id,name'),
        ]);
    }
}