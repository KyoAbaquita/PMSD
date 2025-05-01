<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::query();
        
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        
        if ($request->has('assigned_to_me') && $request->assigned_to_me) {
            $query->where('assigned_to', auth()->id());
        }
        
        if ($request->has('limit')) {
            $query->limit($request->limit);
        }
        
        $tasks = $query->with(['project', 'assignedUser'])->get();
        return response()->json(['tasks' => $tasks]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'required|string|in:todo,in_progress,review,completed',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'start_time' => 'nullable|date',
            'due_time' => 'nullable|date',
            'cost' => 'nullable|numeric',
            'time_spent' => 'nullable|numeric',
        ]);
        

        $task = Task::create($validated);

        return response()->json(['task' => $task], 201);
    }

    public function show(Task $task)
    {
        return response()->json(['task' => $task->load('project', 'assignedUser')]);
    }

    public function update(Request $request, Task $task)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'project_id' => 'required|exists:projects,id',
        'assigned_to' => 'nullable|exists:users,id',
        'status' => 'required|string|in:todo,in_progress,review,completed',
        'priority' => 'required|string|in:low,medium,high,urgent',
        'due_date' => 'nullable|date',
        'start_time' => 'nullable|date',
        'due_time' => 'nullable|date',
        'cost' => 'nullable|numeric',
    ]);

    // Prevent changing status if already completed
    if ($task->status === 'completed' && $validated['status'] !== 'completed') {
        return response()->json(['error' => 'Cannot change status of a completed task.'], 400);
    }

    // Handle time_spent if transitioning to completed
    if ($task->status !== 'completed' && $validated['status'] === 'completed') {
        if ($task->start_time ?? $validated['start_time'] ?? null) {
            $start = Carbon::parse($validated['start_time'] ?? $task->start_time);
            $end = Carbon::now();
            $validated['time_spent'] = $start->diffInHours($end);
        }
    }

    $task->update($validated);

    return response()->json(['task' => $task]);
}


    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }

    public function getProjectTasks($projectId)
    {
        $project = Project::findOrFail($projectId);
        $tasks = Task::where('project_id', $projectId)
                    ->with(['assignedUser'])
                    ->get();

        // Transform tasks to ensure assignedUser is included properly
        $transformedTasks = $tasks->map(function ($task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'project_id' => $task->project_id,
                'assigned_to' => $task->assigned_to,
                'status' => $task->status,
                'priority' => $task->priority,
                'start_time' => $task->start_time,
                'due_time' => $task->due_time,
                'cost' => $task->cost,
                'assignedUser' => $task->assignedUser ? [
                    'id' => $task->assignedUser->id,
                    'name' => $task->assignedUser->name,
                ] : null,
            ];
        });
        

        return response()->json(['tasks' => $transformedTasks]);
    }
}
