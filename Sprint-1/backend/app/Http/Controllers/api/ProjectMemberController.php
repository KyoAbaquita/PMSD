<?php

namespace App\Http\Controllers\api;

use App\Models\User;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ActivityLog; // 👈 Add this line

class ProjectMemberController extends Controller
{
    public function index(Project $project)
    {
        $members = $project->members()
            ->select('users.id', 'users.name', 'users.email')
            ->get();

        return response()->json(['members' => $members]);
    }

    public function store(Request $request, Project $project)
    {
        if ($project->user_id !== auth()->id()) {
            return response()->json(['error' => 'Only the project owner can manage members.'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        if ($project->members()->where('user_id', $request->user_id)->exists()) {
            return response()->json(['message' => 'User is already a project member.'], 409);
        }

        $project->members()->attach($request->user_id);

        // 👇 Create activity log for the added user
        ActivityLog::create([
            'user_id' => $request->user_id,
            'project_id' => $project->id,
            'action' => 'added_to_project',
            'description' => "You have been added to the project: {$project->name}",
        ]);

        return response()->json(['message' => 'User added to project successfully.']);
    }

    public function destroy(Project $project, User $user)
    {
        if ($project->user_id !== auth()->id()) {
            return response()->json(['error' => 'Only the project owner can manage members.'], 403);
        }

        if ($user->id === $project->user_id) {
            return response()->json(['message' => 'The project creator cannot be removed.'], 403);
        }
        
        if ($project->tasks()->where('assigned_to', $user->id)->exists()) {
            return response()->json(['message' => 'User cannot be removed as they have tasks assigned.'], 403);
        }

        $project->members()->detach($user->id);

        // 👇 Create activity log for the removed user
        ActivityLog::create([
            'user_id' => $user->id,
            'project_id' => $project->id,
            'action' => 'removed_from_project',
            'description' => "You have been removed from the project: {$project->name}",
        ]);

        return response()->json(['message' => 'User removed from project.']);
    }
}
