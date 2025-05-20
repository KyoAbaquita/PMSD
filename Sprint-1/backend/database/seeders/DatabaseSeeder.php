<?php

namespace Database\Seeders;

use App\Models\Task;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create fixed admin user
        $admin = User::factory()->create([
            'name' => 'Admin Demo',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create 10 team members
        $teamMembers = User::factory(10)->create();

        // Create 2–3 projects owned by admin
        Project::factory(rand(2, 3))->create([
            'user_id' => $admin->id,
        ])->each(function ($project) use ($admin, $teamMembers) {
            // assign admin as a member of this project
            $project->members()->attach($admin->id);

            // Attach 3 random members to this project
            $assignedMembers = $teamMembers->random(3);
            $project->members()->attach($assignedMembers->pluck('id')->toArray());

            // Assign 2–4 tasks to these members
            foreach ($assignedMembers as $member) {
                Task::factory(rand(2, 4))->create([
                    'project_id' => $project->id,
                    'assigned_to' => $member->id,
                ]);
            }
        });

        // Optionally: keep seeding projects owned by other users too
        $teamMembers->each(function ($user) {
            Project::factory(rand(1, 2))->create([
                'user_id' => $user->id,
            ])->each(function ($project) use ($user) {
                Task::factory(rand(1, 3))->create([
                    'project_id' => $project->id,
                    'assigned_to' => $user->id,
                ]);
            });
        });
    }

}
