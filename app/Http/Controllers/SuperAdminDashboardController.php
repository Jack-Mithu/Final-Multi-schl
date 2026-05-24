<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Course;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Enrollment;
use App\Models\AssessmentFile;
use App\Models\AssignmentSubmission;

class SuperAdminDashboardController extends Controller
{
    public function index()
    {
        // Verify user is superadmin (tenant_id is null or user has superadmin flag)
        $user = Auth::user();
        if ($user->tenant_id !== null) {
            return redirect('/dashboard')->with('error', 'Unauthorized access');
        }

        // Get all tenants
        $tenants = Tenant::all();

        $tenantsData = [];
        foreach ($tenants as $tenant) {
            $tenantId = $tenant->tenant_id;

            $totalStudents = Student::where('tenant_id', $tenantId)->count();
            $totalTeachers = Teacher::where('tenant_id', $tenantId)->count();
            $totalCourses = Course::where('tenant_id', $tenantId)->count();
            $totalEnrollments = Enrollment::where('tenant_id', $tenantId)->count();
            $totalAssessments = AssessmentFile::where('tenant_id', $tenantId)->count();
            $totalSubmissions = AssignmentSubmission::where('tenant_id', $tenantId)->count();

            // Get graded submissions count
            $gradedSubmissions = AssignmentSubmission::where('tenant_id', $tenantId)
                ->whereNotNull('grade')
                ->count();

            // Get list of teachers
            $teachers = Teacher::where('tenant_id', $tenantId)
                ->with('user')
                ->get()
                ->map(function ($teacher) {
                    return [
                        'teacher_id' => $teacher->teacher_id,
                        'name' => ($teacher->user ? $teacher->user->name : 'N/A'),
                        'email' => ($teacher->user ? $teacher->user->email : 'N/A'),
                        'subject' => $teacher->subject ?? 'N/A',
                    ];
                })
                ->toArray();

            // Get list of courses with teacher info
            $courses = Course::where('tenant_id', $tenantId)
                ->with('teacher.user')
                ->get()
                ->map(function ($course) {
                    return [
                        'course_id' => $course->course_id,
                        'course_name' => $course->course_name,
                        'teacher_name' => ($course->teacher && $course->teacher->user ? $course->teacher->user->name : 'Unassigned'),
                    ];
                })
                ->toArray();

            // Get recent submissions
            $recentSubmissions = AssignmentSubmission::where('tenant_id', $tenantId)
                ->with('student.user', 'assessment.course')
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get()
                ->map(function ($sub) {
                    return [
                        'submission_id' => $sub->submission_id,
                        'student_name' => ($sub->student && $sub->student->user ? $sub->student->user->name : 'N/A'),
                        'course_name' => ($sub->assessment && $sub->assessment->course ? $sub->assessment->course->course_name : 'N/A'),
                        'file_name' => $sub->file_name,
                        'submitted_at' => $sub->created_at->format('Y-m-d H:i'),
                        'grade' => $sub->grade !== null ? (float) $sub->grade : null,
                    ];
                })
                ->toArray();

            $tenantsData[] = [
                'tenant_id' => $tenantId,
                'school_name' => $tenant->school_name,
                'address' => $tenant->address ?? 'N/A',
                'phone' => $tenant->phone ?? 'N/A',
                'email' => $tenant->email ?? 'N/A',
                'stats' => [
                    'total_students' => $totalStudents,
                    'total_teachers' => $totalTeachers,
                    'total_courses' => $totalCourses,
                    'total_enrollments' => $totalEnrollments,
                    'total_assessments' => $totalAssessments,
                    'total_submissions' => $totalSubmissions,
                    'graded_submissions' => $gradedSubmissions,
                ],
                'teachers' => $teachers,
                'courses' => $courses,
                'recent_submissions' => $recentSubmissions,
            ];
        }

        // Overall stats
        $totalTenants = count($tenantsData);
        $totalStudentsGlobal = array_sum(array_map(fn($t) => $t['stats']['total_students'], $tenantsData));
        $totalTeachersGlobal = array_sum(array_map(fn($t) => $t['stats']['total_teachers'], $tenantsData));
        $totalCoursesGlobal = array_sum(array_map(fn($t) => $t['stats']['total_courses'], $tenantsData));
        $totalSubmissionsGlobal = array_sum(array_map(fn($t) => $t['stats']['total_submissions'], $tenantsData));

        return Inertia::render('superadmin/dashboard', [
            'tenants' => $tenantsData,
            'global_stats' => [
                'total_tenants' => $totalTenants,
                'total_students' => $totalStudentsGlobal,
                'total_teachers' => $totalTeachersGlobal,
                'total_courses' => $totalCoursesGlobal,
                'total_submissions' => $totalSubmissionsGlobal,
            ],
        ]);
    }
}
