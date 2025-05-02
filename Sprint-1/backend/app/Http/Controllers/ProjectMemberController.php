<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\User;

class ProjectMemberController extends Controller
{
    // List all members of the project
    public function index(Project $project)
    {
        $members = $project->members()
            ->select('users.id', 'users.name', 'users.email')
            ->get();

        return response()->json(['members' => $members]);
    }



    // Add a user to the project
    public function store(Request $request, Project $project)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        if ($project->members()->where('user_id', $request->user_id)->exists()) {
            return response()->json(['message' => 'User is already a project member.'], 409);
        }

        $project->members()->attach($request->user_id);

        return response()->json(['message' => 'User added to project successfully.']);
    }

    // Remove a user from the project
    public function destroy(Project $project, User $user)
    {
        // Prevent removing the creator
        if ($user->id === $project->user_id) {
            return response()->json(['message' => 'The project creator cannot be removed.'], 403);
        }

        $project->members()->detach($user->id);

        return response()->json(['message' => 'User removed from project.']);
    }

}
