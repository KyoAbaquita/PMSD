<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'budget',
        'start_date',
        'due_date',
        'status',
        'user_id'
    ];

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
        'budget' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function members()
    {
        return $this->belongsToMany(User::class);
    }

    public function expenditures()
    {
        return $this->hasMany(ProjectExpenditure::class);
    }

    public function getRemainingBudgetAttribute()
    {
        return $this->budget - $this->expenditures->sum('amount');
    }

    public function riskIssues()
    {
        return $this->hasMany(RiskIssue::class);
    }


}
