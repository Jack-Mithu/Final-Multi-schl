<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\AssessmentFile;
use App\Models\Student;
use App\Models\Enrollment;
use App\Models\AssignmentSubmission;
use App\Http\Controllers\Traits\Toastable;

class StudentAssessmentController extends Controller
{
    use Toastable;
    public function index()
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        // Get the student record for the logged-in user
        $student = Student::where('user_id', $user->id)
            ->where('tenant_id', $tenantId)
            ->first();

        if (!$student) {
            return Inertia::render('student/assessments', [
                'enrolledCourses' => [],
                'assessments' => [],
            ]);
        }

        // Get enrolled courses for this student
        $enrolledCourses = Enrollment::where('student_id', $student->student_id)
            ->where('tenant_id', $tenantId)
            ->pluck('course_id')
            ->toArray();

        // Get assessment files for enrolled courses
        $assessments = AssessmentFile::whereIn('course_id', $enrolledCourses)
            ->where('tenant_id', $tenantId)
            ->with('course')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($assessment) use ($student, $tenantId) {
                // Get user's submission for this assessment
                $userSubmission = AssignmentSubmission::where('assessment_id', $assessment->assessment_id)
                    ->where('student_id', $student->student_id)
                    ->where('tenant_id', $tenantId)
                    ->first();

                $submissionData = null;
                if ($userSubmission) {
                    $submissionData = [
                        'submission_id' => $userSubmission->submission_id,
                        'file_name' => $userSubmission->file_name,
                        'file_size' => $this->formatFileSize($userSubmission->file_size),
                        'submitted_at' => $userSubmission->created_at->format('Y-m-d H:i'),
                        'grade' => $userSubmission->grade !== null ? (float) $userSubmission->grade : null,
                        'feedback' => $userSubmission->feedback,
                    ];
                }

                return [
                    'assessment_id' => $assessment->assessment_id,
                    'course_name' => $assessment->course->course_name,
                    'title' => $assessment->title,
                    'description' => $assessment->description,
                    'file_name' => $assessment->file_name,
                    'file_type' => $assessment->file_type,
                    'file_size' => $this->formatFileSize($assessment->file_size),
                    'created_at' => $assessment->created_at->format('Y-m-d H:i'),
                    'submission_deadline' => $assessment->submission_deadline,
                    'user_submission' => $submissionData,
                ];
            })
            ->toArray();

        return Inertia::render('student/assessments', [
            'enrolledCourses' => count($enrolledCourses),
            'assessments' => $assessments,
        ]);
    }

    public function download($id)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        $assessment = AssessmentFile::find($id);

        if (!$assessment || $assessment->tenant_id != $tenantId) {
            return back()->withErrors('Unauthorized');
        }

        // Verify student is enrolled in this course
        $student = Student::where('user_id', $user->id)->first();
        $enrollment = Enrollment::where('student_id', $student->student_id)
            ->where('course_id', $assessment->course_id)
            ->where('tenant_id', $tenantId)
            ->first();

        if (!$enrollment) {
            return back()->withErrors('You are not enrolled in this course');
        }

        // Check if file exists in storage. Try local disk first, then private as a fallback.
        if (Storage::disk('local')->exists($assessment->file_path)) {
            return Storage::disk('local')->download($assessment->file_path, $assessment->file_name);
        }

        if (config('filesystems.disks.private') && Storage::disk('private')->exists($assessment->file_path)) {
            return Storage::disk('private')->download($assessment->file_path, $assessment->file_name);
        }

        // Log missing file for debugging and return a user-friendly error
        \Log::warning("Assessment file not found for assessment_id={$assessment->assessment_id}, path={$assessment->file_path}");
        return back()->withErrors('File not found');
    }

    public function submit(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|max:52428800', // 50MB max
        ]);

        $user = Auth::user();
        $tenantId = $user->tenant_id;

        $assessment = AssessmentFile::find($id);

        if (!$assessment || $assessment->tenant_id != $tenantId) {
            return back()->withErrors('Unauthorized');
        }

        // Verify student is enrolled in this course
        $student = Student::where('user_id', $user->id)
            ->where('tenant_id', $tenantId)
            ->first();

        if (!$student) {
            return back()->withErrors('Student profile not found');
        }

        $enrollment = Enrollment::where('student_id', $student->student_id)
            ->where('course_id', $assessment->course_id)
            ->where('tenant_id', $tenantId)
            ->first();

        if (!$enrollment) {
            return back()->withErrors('You are not enrolled in this course');
        }

        // Check if deadline has passed
        if ($assessment->submission_deadline && new \DateTime($assessment->submission_deadline) < new \DateTime()) {
            return back()->withErrors('Submission deadline has passed');
        }

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $fileType = $file->getClientOriginalExtension();
        $fileSize = $file->getSize();

        // Delete previous submission if exists
        $previousSubmission = AssignmentSubmission::where('assessment_id', $assessment->assessment_id)
            ->where('student_id', $student->student_id)
            ->where('tenant_id', $tenantId)
            ->first();

        if ($previousSubmission) {
            if (Storage::disk('local')->exists($previousSubmission->file_path)) {
                Storage::disk('local')->delete($previousSubmission->file_path);
            }
            $previousSubmission->delete();
        }

        // Store new submission file
        $path = $file->storeAs(
            "submissions/tenant_{$tenantId}/assessment_{$assessment->assessment_id}",
            $fileName,
            'local'
        );

        // Create submission record
        AssignmentSubmission::create([
            'tenant_id' => $tenantId,
            'assessment_id' => $assessment->assessment_id,
            'student_id' => $student->student_id,
            'file_name' => $fileName,
            'file_path' => $path,
            'file_type' => $fileType,
            'file_size' => $fileSize,
        ]);

        return $this->toastSuccessBack('Assignment submitted successfully');
    }

    public function grades()
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        // Get the student record for the logged-in user
        $student = Student::where('user_id', $user->id)
            ->where('tenant_id', $tenantId)
            ->first();

        if (!$student) {
            return Inertia::render('student/grades', [
                'courses' => [],
            ]);
        }

        // Get enrolled courses for this student
        $enrolledCourseIds = Enrollment::where('student_id', $student->student_id)
            ->where('tenant_id', $tenantId)
            ->pluck('course_id')
            ->toArray();

        $courses = \App\Models\Course::whereIn('course_id', $enrolledCourseIds)
            ->where('tenant_id', $tenantId)
            ->get();

        $coursesData = [];
        foreach ($courses as $course) {
            $assessments = AssessmentFile::where('tenant_id', $tenantId)
                ->where('course_id', $course->course_id)
                ->orderBy('created_at', 'desc')
                ->get();

            $assessmentGrades = [];
            $sum = 0;
            $count = 0;

            foreach ($assessments as $assessment) {
                $submission = AssignmentSubmission::where('tenant_id', $tenantId)
                    ->where('assessment_id', $assessment->assessment_id)
                    ->where('student_id', $student->student_id)
                    ->first();

                $grade = null;
                $feedback = null;
                if ($submission && $submission->grade !== null) {
                    $grade = (float) $submission->grade;
                    $feedback = $submission->feedback;
                    $sum += $grade;
                    $count++;
                }

                $assessmentGrades[] = [
                    'assessment_id' => $assessment->assessment_id,
                    'title' => $assessment->title,
                    'grade' => $grade,
                    'feedback' => $feedback,
                ];
            }

            $average = $count > 0 ? round($sum / $count, 2) : null;

            $coursesData[] = [
                'course_id' => $course->course_id,
                'course_name' => $course->course_name,
                'average_grade' => $average,
                'assessments' => $assessmentGrades,
            ];
        }

        return Inertia::render('student/grades', [
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
