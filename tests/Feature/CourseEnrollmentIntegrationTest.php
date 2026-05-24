<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Course;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

class CourseEnrollmentIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_course_and_student_can_enroll()
    {
        $this->withoutMiddleware();
        // Roles
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);

        // Admin user (tenant 1)
        $admin = User::factory()->create(['tenant_id' => 1]);
        $admin->assignRole('admin');

        // Teacher created (tenant 1)
        $teacherUser = User::factory()->create(['tenant_id' => 1]);
        $teacher = Teacher::factory()->create([
            'tenant_id' => 1,
            'user_id' => $teacherUser->id,
        ]);

        // Admin creates course using Teacher
        $this->actingAs($admin)->post(route('courses.store'), [
            'course_name' => 'Advanced Programming',
            'teacher_id' => $teacher->teacher_id,
        ])->assertRedirect(route('courses.index', absolute: false));

        $course = Course::where('tenant_id', 1)
            ->where('course_name', 'Advanced Programming')
            ->first();

        $this->assertNotNull($course);

        // Student user + student record (tenant 1)
        $studentUser = User::factory()->create(['tenant_id' => 1]);
        $studentUser->assignRole('student');

        $student = Student::create([
            'tenant_id' => 1,
            'user_id' => $studentUser->id,
            'first_name' => 'Test',
            'last_name' => 'Student',
            'grade' => 'Grade 10',
        ]);

        // Student enrolls in the created course (Integration: Student + Enrollment + Course)
        $this->actingAs($studentUser)->post(route('enrollments.store'), [
            'student_id' => $student->student_id,
            'course_id' => $course->course_id,
            'enrollment_date' => now()->toDateString(),
        ])->assertStatus(302);

        // Verify enrollment exists
        $this->assertDatabaseHas('enrollments', [
            'tenant_id' => 1,
            'student_id' => $student->student_id,
            'course_id' => $course->course_id,
        ]);
    }
}

