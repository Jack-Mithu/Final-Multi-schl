<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;
use App\Models\AssessmentFile;
use App\Models\AssignmentSubmission;

class TeacherSubmissionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        // Get teacher record
        $teacher = \App\Models\Teacher::where('user_id', $user->id)->first();
        if (!$teacher) {
            return Inertia::render('teacher/submissions', [
                'courses' => [],
            ]);
        }

        // Courses taught by this teacher
        $courses = Course::where('tenant_id', $tenantId)
            ->where('teacher_id', $teacher->teacher_id)
            ->get();

        $coursesData = [];

        foreach ($courses as $course) {
            $assessments = AssessmentFile::where('tenant_id', $tenantId)
                ->where('course_id', $course->course_id)
                ->orderBy('created_at', 'desc')
                ->get();

            $assessmentsData = [];
            foreach ($assessments as $assessment) {
                $subs = AssignmentSubmission::where('tenant_id', $tenantId)
                    ->where('assessment_id', $assessment->assessment_id)
                    ->with('student.user')
                    ->orderBy('created_at', 'desc')
                    ->get();

                $subsData = $subs->map(function ($s) {
                    return [
                        'submission_id' => $s->submission_id,
                        'student_name' => $s->student->first_name . ' ' . $s->student->last_name,
                        'student_email' => $s->student->user->email ?? 'N/A',
                        'file_name' => $s->file_name,
                        'file_size' => $this->formatFileSize($s->file_size),
                        'submitted_at' => $s->created_at->format('Y-m-d H:i:s'),
                        'grade' => $s->grade !== null ? (float) $s->grade : null,
                        'feedback' => $s->feedback,
                    ];
                })->toArray();

                $assessmentsData[] = [
                    'assessment_id' => $assessment->assessment_id,
                    'title' => $assessment->title,
                    'submission_deadline' => $assessment->submission_deadline,
                    'submissions' => $subsData, //child node
                ];
            }

            $coursesData[] = [
                'course_id' => $course->course_id,
                'course_name' => $course->course_name,
                'assessments' => $assessmentsData, //child node
            ];
        }

        return Inertia::render('teacher/submissions', [
            'courses' => $coursesData,
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
