<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-1 week', 'now');
        $end = $this->faker->dateTimeBetween($start, '+1 week');

        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph,
            'project_id' => Project::factory(),
            'assigned_to' => User::factory(),
            'status' => $this->faker->randomElement(['todo', 'in_progress', 'review', 'completed']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            'start_time' => $start,
            'due_time' => $end,
            'time_spent' => $this->faker->randomFloat(1, 1, 24),
        ];
    }
}
