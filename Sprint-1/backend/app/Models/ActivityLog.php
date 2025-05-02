<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = ['user_id', 'project_id', 'task_id', 'action', 'description'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
