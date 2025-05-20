<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiskIssue extends Model
{
    use HasFactory;

    protected $table = 'risks_issues';
    
    protected $fillable = [
        'project_id',
        'type',
        'title',
        'description',
        'status',
        'impact_level',
        'created_by',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
