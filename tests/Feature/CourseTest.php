<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Teacher;
use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CourseTest extends TestCase
{
    use RefreshDatabase;

    public function test_course_can_be_created()
{

    $this->withoutMiddleware();

    $user = User::factory()->create(['tenant_id' => 1]);

    // Ensure role exists then assign it
    Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $user->assignRole('admin');

    $teacher = Teacher::factory()->create(['tenant_id' => 1]);

    $response = $this->actingAs($user)->post(route('courses.store'), [
        'course_name' => 'Web Development',
        'teacher_id' => $teacher->teacher_id,
    ]);

    $response->assertRedirect(route('courses.index', absolute: false));

    $this->assertDatabaseHas('courses', [
        'course_name' => 'Web Development',
        'tenant_id' => 1,
        'teacher_id' => $teacher->teacher_id,
    ]);
}
}
