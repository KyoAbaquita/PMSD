<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('project_id')->constrained('projects');
            $table->foreignId('assigned_to')->nullable()->constrained('users');
            $table->string('status')->default('todo');
            $table->string('priority')->default('medium');
            $table->dateTime('start_time')->nullable();
            $table->dateTime('due_time')->nullable();
            $table->float('time_spent')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
