<?php

namespace App\Http\Controllers\api;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\ProjectExpenditure;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ProjectExpenditureController extends Controller
{
    public function index($projectId)
    {
        $project = Project::findOrFail($projectId);

        $user = Auth::user();

        $isOwner = $user->id === $project->user_id;
        $isMember = $project->members()->where('user_id', $user->id)->exists();

        if (!$isOwner && !$isMember) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $expenditures = $project->expenditures()->latest()->get();
        return response()->json($expenditures);
    }


    public function store(Request $request, $projectId)
    {
        $project = Project::findOrFail($projectId);

        if (Auth::id() !== $project->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string',
        ]);

        $expenditure = ProjectExpenditure::create([
            'project_id' => $projectId,
            'amount' => $request->amount,
            'description' => $request->description,
        ]);

        return response()->json($expenditure, 201);
    }

    public function destroy($id)
    {
        $expenditure = ProjectExpenditure::findOrFail($id);
        $project = $expenditure->project;

        if (Auth::id() !== $project->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $expenditure->delete();
        return response()->json(['message' => 'Expenditure deleted']);
    }

}
