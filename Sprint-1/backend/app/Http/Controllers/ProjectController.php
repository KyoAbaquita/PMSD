<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('user')->get();
        return response()->json(['projects' => $projects]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|string|in:planning,active,completed,on_hold',
        ]);

        $project = Project::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? null,
            'status' => $validated['status'],
            'user_id' => auth()->id(),
        ]);

        return response()->json(['project' => $project], 201);
    }

    public function show(Project $project)
    {
        return response()->json(['project' => $project->load('tasks', 'user')]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
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
        $project->delete();
        return response()->json(['message' => 'Project deleted successfully']);
    }
}
