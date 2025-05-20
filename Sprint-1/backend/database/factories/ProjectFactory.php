<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $start = $this->faker->date();
        $due = $this->faker->dateTimeBetween('+1 week', '+2 months')->format('Y-m-d');

        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph,
            'start_date' => $start,
            'due_date' => $due,
            'status' => 'planning',
            'budget' => $this->faker->randomFloat(2, 1000, 100000),
            'user_id' => User::factory(), // assign to a user
        ];
    }
}
