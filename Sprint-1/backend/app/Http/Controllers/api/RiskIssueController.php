<?php

namespace App\Http\Controllers\api;

use App\Models\Project;
use App\Models\RiskIssue;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class RiskIssueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Project $project)
    {
        $this->authorizeAccess($project);

        $items = $project->riskIssues()->latest()->get();
        return response()->json($items);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Project $project)
    {
        $this->authorizeAccess($project);


        $validated = $request->validate([
            'type' => 'required|in:risk,issue',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'impact_level' => 'nullable|in:low,medium,high',
        ]);

        if ($validated['type'] === 'risk' && $project->user_id !== Auth::id()) {
            return response()->json(['error' => 'Only project owners can add risks.'], 403);
        }


        $item = RiskIssue::create([
            'project_id' => $project->id,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'impact_level' => $validated['impact_level'] ?? null,
            'status' => 'open',
            'created_by' => Auth::id(),
        ]);

        $memberIds = $project->members()->pluck('users.id')->toArray();
        $memberIds[] = $project->user_id;

        foreach (array_unique($memberIds) as $userId) {
            ActivityLog::create([
                'user_id' => $userId,
                'project_id' => $project->id,
                'action' => 'risk_issue_created',
                'description' => "A new {$item->type} was reported: '{$item->title}' in project '{$project->name}'",
            ]);
        }

        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project, RiskIssue $riskIssue)
    {
        $this->authorizeAccess($project);

        if (
            $riskIssue->type === 'risk' &&
            $project->user_id !== Auth::id()
        ) {
            return response()->json(['error' => 'Only project owners can update risks.'], 403);
        }

        if (
            $riskIssue->project->user_id !== auth()->id() &&
            !$riskIssue->project->members()->where('user_id', auth()->id())->exists()
        ) {
            return response()->json(['message' => 'Forbidden'], 403);
        }


        if ($riskIssue->project_id !== $project->id) {
            return response()->json(['error' => 'Invalid project item.'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'impact_level' => 'nullable|in:low,medium,high',
            'status' => 'required|in:open,mitigated,resolved,closed',
        ]);

        $riskIssue->update($validated);

        $project = $riskIssue->project;
        $memberIds = $project->members()->pluck('users.id')->toArray();
        $memberIds[] = $project->user_id;

        foreach (array_unique($memberIds) as $userId) {
            ActivityLog::create([
                'user_id' => $userId,
                'project_id' => $project->id,
                'action' => 'risk_issue_updated',
                'description' => "The {$riskIssue->type} '{$riskIssue->title}' has been updated in project '{$project->name}'",
            ]);
        }

        return response()->json($riskIssue);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, RiskIssue $riskIssue)
    {
        $this->authorizeAccess($project);

        // Only the project owner can delete risks or issues
        if ($project->user_id !== Auth::id()) {
            return response()->json(['error' => 'Only the project owner can delete risks or issues.'], 403);
        }

        if ($riskIssue->project_id !== $project->id) {
            return response()->json(['error' => 'Invalid project item.'], 403);
        }

        $riskIssue->delete();

        return response()->json(['message' => 'Deleted successfully.']);
    }


    private function authorizeAccess(Project $project)
    {
        $user = Auth::user();

        $isOwner = $project->user_id === $user->id;
        $isMember = $project->members()->where('user_id', $user->id)->exists();

        if (!($isOwner || $isMember)) {
            abort(403, 'Unauthorized access to project risks/issues.');
        }
    }
}
