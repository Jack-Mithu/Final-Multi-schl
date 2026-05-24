<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // First, seed roles
        $this->call(RoleSeeder::class);

        // Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Set tenant_id to own ID for admin (they are their own tenant)
        if (!$admin->tenant_id) {
            $admin->update(['tenant_id' => $admin->id]);
        }

        // Assign admin role
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        // Create Teacher User
        $teacher = User::firstOrCreate(
            ['email' => 'teacher@example.com'],
            [
                'name' => 'Teacher User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'tenant_id' => $admin->id, // Belongs to admin's tenant
            ]
        );

        // Assign teacher role
        if (!$teacher->hasRole('teacher')) {
            $teacher->assignRole('teacher');
        }

        // Create Student User
        $student = User::firstOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'Student User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'tenant_id' => $admin->id, // Belongs to admin's tenant
            ]
        );

        // Assign student role
        if (!$student->hasRole('student')) {
            $student->assignRole('student');
        }

        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('');
        $this->command->info('Test Users Created:');
        $this->command->info('  Admin:   admin@example.com / password');
        $this->command->info('  Teacher: teacher@example.com / password');
        $this->command->info('  Student: student@example.com / password');
    }
}
