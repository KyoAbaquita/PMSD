<?php

namespace App\Http\Controllers\api;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $projects = Project::with('members')
            ->where('user_id', $user->id) // owner
            ->orWhereHas('members', function ($query) use ($user) {
                $query->where('user_id', $user->id); // member
            })
            ->latest()
            ->take($request->input('limit', 5))
            ->get();

        return response()->json(['projects' => $projects]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:planning,active,on_hold,completed',
            'budget' => 'nullable|numeric|min:0',
        ]);

        $project = new Project($request->all());
        $project->user_id = $request->user()->id; // 👈 add this line
        $project->save();

        $project->members()->attach($request->user()->id); // 👈 creator as member

        return response()->json(['project' => $project], 201);
    }



    public function show(Project $project)
    {
        $project->load('tasks'); // ensure tasks are loaded

        $actual_cost = $project->tasks->sum('cost');

        return response()->json([
            'project' => $project,
            'actual_cost' => $actual_cost,
        ]);
    }


    public function update(Request $request, Project $project)
    {
        // Check if the authenticated user is the owner of the project
        if ($project->user_id !== auth()->id()) {
            return response()->json(['error' => 'Only the project owner can perform this action.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'due_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|string|in:planning,active,completed,on_hold',
            'budget' => 'nullable|numeric',
            'actual_expenditure' => 'nullable|numeric',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        $project->update($validated);

        return response()->json(['project' => $project]);
    }

    public function destroy(Project $project)
    {
        if ($project->user_id !== auth()->id()) {
            return response()->json(['error' => 'Only the project owner can delete this project.'], 403);
        }

        $project->delete();
        return response()->json(['message' => 'Project deleted successfully']);
    }

}
