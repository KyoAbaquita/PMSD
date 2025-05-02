<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TaskComment extends Model
{
    use HasFactory;

    protected $fillable = ['task_id', 'user_id', 'comment'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
