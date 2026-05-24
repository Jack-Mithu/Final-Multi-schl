<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\Teacher;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Course;
use App\Models\Student;
use App\Models\Enrollment;
use App\Models\Timetable;
use App\Models\AssessmentFile;
use App\Models\AssignmentSubmission;

class TeacherDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;
        
        // Get the teacher record for the logged-in user
        $teacher = Teacher::where('user_id', $user->id)->first();
        
        if (!$teacher) {
            // If no teacher record exists, show message
            return Inertia::render('teacher/dashboard', [
                'error' => 'Teacher profile not found. Please contact administrator.',
                'schoolName' => Tenant::where('tenant_id', $tenantId)->value('school_name'),
            ]);
        }
        
        $schoolName = Tenant::where('tenant_id', $tenantId)->value('school_name');
        
        // Get teacher-specific data
        $teacherInfo = [
            'name' => $teacher->first_name . ' ' . $teacher->last_name,
            'subject' => $teacher->subject,
            'email' => $user->email,
        ];
        
        // Get courses taught by this teacher
        $courses = Course::where('tenant_id', $tenantId)
            ->where('teacher_id', $teacher->teacher_id)
            ->with(['enrollments.student'])
            ->get();
        
        // Count courses taught by this teacher
        $totalCourses = $courses->count();
        
        // Get all unique students with details
        $students = Student::whereIn('student_id', 
            Enrollment::whereIn('course_id', $courses->pluck('course_id'))
                ->pluck('student_id')
        )
        ->where('tenant_id', $tenantId)
        ->with('user')
        ->get()
        ->map(function ($student) {
            return [
                'student_id' => $student->student_id,
                'name' => $student->first_name . ' ' . $student->last_name,
                'email' => $student->user->email ?? 'N/A',
            ];
        })
        ->toArray();
        
        $totalStudents = count($students);
        
        // Count subjects taught by this teacher (usually 1, but could be more)
        $totalSubjects = 1; // This teacher's subject
        
        // Get enrollments with course and student details
        $enrollments = Enrollment::whereIn('course_id', $courses->pluck('course_id'))
            ->where('tenant_id', $tenantId)
            ->with(['student', 'course'])
            ->get()
            ->map(function ($enrollment) {
                return [
                    'enrollment_id' => $enrollment->enrollment_id,
                    'student_name' => $enrollment->student->first_name . ' ' . $enrollment->student->last_name,
                    'course_name' => $enrollment->course->course_name,
                    'enrollment_date' => $enrollment->enrollment_date,
                ];
            })
            ->toArray();
        
        $totalEnrollments = count($enrollments);
        
        // Format courses with details
        $coursesData = $courses->map(function ($course) {
            $enrollmentCount = $course->enrollments->count();
            return [
                'course_id' => $course->course_id,
                'course_name' => $course->course_name,
                'enrollment_count' => $enrollmentCount,
            ];
        })
        ->toArray();
        
        // Get timetables for this teacher's courses with enrolled students
        $timetables = Timetable::where('tenant_id', $tenantId)
            ->whereIn('course_id', $courses->pluck('course_id'))
            ->with(['course.enrollments.student'])
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        // Get submitted assignments with student details, grouped by assessment
        $submissionsRaw = AssignmentSubmission::where('tenant_id', $tenantId)
            ->whereIn('assessment_id', 
                AssessmentFile::where('tenant_id', $tenantId)
                    ->whereIn('course_id', $courses->pluck('course_id'))
                    ->pluck('assessment_id')
            )
            ->with(['student', 'assessment.course'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Group submissions by assessment
        $submissionsByAssessment = [];
        foreach ($submissionsRaw as $submission) {
            $assessmentId = $submission->assessment_id;
            
            if (!isset($submissionsByAssessment[$assessmentId])) {
                $submissionsByAssessment[$assessmentId] = [
                    'assessment_id' => $assessmentId,
                    'assignment_title' => $submission->assessment->title,
                    'course_name' => $submission->assessment->course->course_name,
                    'submissions' => [],
                ];
            }
            
            $submissionsByAssessment[$assessmentId]['submissions'][] = [
                'submission_id' => $submission->submission_id,
                'student_name' => $submission->student->first_name . ' ' . $submission->student->last_name,
                'student_email' => $submission->student->user->email ?? 'N/A',
                'file_name' => $submission->file_name,
                'file_size' => $this->formatFileSize($submission->file_size),
                'submitted_at' => $submission->created_at->format('Y-m-d H:i:s'),
            ];
        }

        $submissions = array_values($submissionsByAssessment);

        return Inertia::render('teacher/dashboard', [
            'schoolName' => $schoolName,
            'teacherInfo' => $teacherInfo,
            'totalStudents' => $totalStudents,
            'totalCourses' => $totalCourses,
            'totalSubjects' => $totalSubjects,
            'totalEnrollments' => $totalEnrollments,
            'students' => $students,
            'courses' => $coursesData,
            'subjects' => [$teacher->subject],
            'enrollments' => $enrollments,
            'submissions' => $submissions,
        ]);
    }

    private function formatFileSize($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, 2) . ' ' . $units[$pow];
    }
}