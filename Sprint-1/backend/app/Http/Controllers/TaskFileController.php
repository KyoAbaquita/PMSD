<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskFile;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TaskFileController extends Controller
{
    public function index(Task $task)
    {
        return response()->json([
            'files' => $task->files()->with('user:id,name')->latest()->get()
        ]);
    }

    public function store(Request $request, Task $task)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // Max 10 MB
        ]);

        $uploadedFile = $request->file('file');
        $path = $uploadedFile->store('task_files');

        $taskFile = TaskFile::create([
            'task_id' => $task->id,
            'user_id' => Auth::id(),
            'filename' => $uploadedFile->getClientOriginalName(),
            'path' => $path,
        ]);

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'file_uploaded',
            'description' => 'Uploaded file "' . $taskFile->filename . '" to task "' . $task->title . '"',
            'project_id' => $task->project_id,
            'task_id' => $task->id,
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'file' => $taskFile->load('user:id,name'),
        ]);
    }

    public function download(TaskFile $file)
    {
        return Storage::download($file->path, $file->filename);
    }

    public function destroy(TaskFile $file)
    {
        $this->authorize('delete', $file);
        Storage::delete($file->path);
        $file->delete();

        return response()->json(['message' => 'File deleted']);
    }
}