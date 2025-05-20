<?php

namespace App\Http\Controllers\api;

use Carbon\Carbon;
use App\Models\Task;
use App\Models\Project;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
        $project = Project::findOrFail($request->project_id);
        // Check if the authenticated user is the owner of the project
        if ($project->user_id !== auth()->id()) {
            return response()->json(['error' => 'Only the project owner can create tasks.'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'status' => 'required|string|in:todo,in_progress,review,completed',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'start_time' => 'nullable|date',
            'due_time' => 'nullable|date',
            'time_spent' => 'nullable|numeric',
        ]);

        $task = Task::create($validated);

        if ($validated['assigned_to']) {
            ActivityLog::create([
                'user_id' => $validated['assigned_to'],
                'project_id' => $task->project_id,
                'task_id' => $task->id,
                'action' => 'task_assigned',
                'description' => 'You were assigned to task "' . $task->title . '"',
            ]);
        }
        

        return response()->json(['task' => $task], 201);
    }

    public function show(Task $task)
    {
        $task->load('assignedUser', 'project'); // eager load relationships
        return response()->json([
            'task' => $task
        ]);
    }



    public function update(Request $request, Task $task)
    {
        $user = auth()->user();
        // Check if the authenticated user is the owner of the project or assigned to the task
        if ($task->assigned_to !== $user->id && $task->project->user_id !== $user->id) {
            return response()->json(['error' => 'You are not allowed to edit this task.'], 403);
        }

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
        ]);

        // Prevent changing status if already completed for non-owner
        if (
            $task->status === 'completed' &&
            $validated['status'] !== 'completed' &&
            $task->project->user_id !== $user->id
        ) {
            return response()->json(['error' => 'Only the project owner can revert a completed task.'], 403);
        }
        

        // Handle time_spent if transitioning to completed
        if ($task->status !== 'completed' && $validated['status'] === 'completed') {
            if ($task->start_time ?? $validated['start_time'] ?? null) {
                $start = Carbon::parse($validated['start_time'] ?? $task->start_time);
                $end = Carbon::now();
                $validated['time_spent'] = $start->diffInHours($end);
            }
        }

        $previousAssignedTo = $task->assigned_to;

        $task->update($validated);

        if (
            isset($validated['assigned_to']) &&
            $validated['assigned_to'] !== $previousAssignedTo &&
            $validated['assigned_to'] !== null
        ) {
            ActivityLog::create([
                'user_id' => $validated['assigned_to'],
                'project_id' => $task->project_id,
                'task_id' => $task->id,
                'action' => 'task_reassigned',
                'description' => 'You were reassigned to task "' . $task->title . '"',
            ]);
        }

        if (
            isset($validated['assigned_to']) &&
            $validated['assigned_to'] === null &&
            $previousAssignedTo !== null
        ) {
            ActivityLog::create([
                'user_id' => $previousAssignedTo,
                'project_id' => $task->project_id,
                'task_id' => $task->id,
                'action' => 'task_unassigned',
                'description' => 'You were unassigned from task "' . $task->title . '"',
            ]);
        }
        

        return response()->json(['task' => $task]);
    }


    public function destroy(Task $task)
    {
        $user = auth()->user();
        // Check if the authenticated user is the owner of the project or assigned to the task
        if ($task->assigned_to !== $user->id && $task->project->user_id !== $user->id) {
            return response()->json(['error' => 'You are not allowed to delete this task.'], 403);
        }

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
                'assignedUser' => $task->assignedUser ? [
                    'id' => $task->assignedUser->id,
                    'name' => $task->assignedUser->name,
                ] : null,
            ];
        });


        return response()->json(['tasks' => $transformedTasks]);
    }
}
