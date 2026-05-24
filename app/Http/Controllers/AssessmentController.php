<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\AssessmentFile;
use App\Models\Course;
use App\Models\Teacher;
use App\Models\Enrollment;
use App\Models\AssignmentSubmission;

class AssessmentController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        // Get the teacher record for the logged-in user
        $teacher = Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return redirect()->back()->with('error', 'Teacher profile not found');
        }

        // Get courses taught by this teacher
        $courses = Course::where('tenant_id', $tenantId)
            ->where('teacher_id', $teacher->teacher_id)
            ->get();

        // Get all assessment files for this teacher's courses
        $assessments = AssessmentFile::whereIn('course_id', $courses->pluck('course_id'))
            ->where('tenant_id', $tenantId)
            ->with('course')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($assessment) {
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
                ];
            })
            ->toArray();

        return Inertia::render('teacher/assessments', [
            'courses' => $courses,
            'assessments' => $assessments,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,course_id',
            'file' => 'required|file|max:52428800', // 50MB max
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'submission_deadline' => 'nullable|date',
        ]);

        $user = Auth::user();
        $tenantId = $user->tenant_id;

        // Verify the course belongs to this teacher
        $teacher = Teacher::where('user_id', $user->id)->first();
        $course = Course::where('course_id', $request->course_id)
            ->where('teacher_id', $teacher->teacher_id)
            ->first();

        if (!$course) {
            return back()->withErrors('Unauthorized course');
        }

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $fileType = $file->getClientOriginalExtension();
        $fileSize = $file->getSize();

        // Store file in storage/app/private/assessments/tenant/{tenantId}/course/{courseId}/
        $path = $file->storeAs(
            "assessments/tenant_{$tenantId}/course_{$request->course_id}",
            $fileName,
            'local'
        );

        AssessmentFile::create([
            'tenant_id' => $tenantId,
            'course_id' => $request->course_id,
            'file_name' => $fileName,
            'file_path' => $path,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'title' => $request->title,
            'description' => $request->description,
            'submission_deadline' => $request->submission_deadline,
        ]);

        return back()->with('success', 'Assessment file uploaded successfully');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        $assessment = AssessmentFile::find($id);

        if (!$assessment || $assessment->tenant_id != $tenantId) {
            return back()->withErrors('Unauthorized');
        }

        // Verify the course belongs to this teacher
        $teacher = Teacher::where('user_id', $user->id)->first();
        $course = Course::where('course_id', $assessment->course_id)
            ->where('teacher_id', $teacher->teacher_id)
            ->first();

        if (!$course) {
            return back()->withErrors('Unauthorized');
        }

        // Delete the file
        // Delete the file from the same disk used for storing (local). Use private as fallback if configured.
        if (Storage::disk('local')->exists($assessment->file_path)) {
            Storage::disk('local')->delete($assessment->file_path);
        } elseif (config('filesystems.disks.private') && Storage::disk('private')->exists($assessment->file_path)) {
            Storage::disk('private')->delete($assessment->file_path);
        }

        $assessment->delete();

        return back()->with('success', 'Assessment file deleted successfully');
    }

    public function downloadSubmission($submissionId)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        $submission = AssignmentSubmission::find($submissionId);

        if (!$submission || $submission->tenant_id != $tenantId) {
            return back()->withErrors('Unauthorized');
        }

        // Verify the assessment belongs to a course taught by this teacher
        $assessment = AssessmentFile::find($submission->assessment_id);
        $teacher = Teacher::where('user_id', $user->id)->first();
        $course = Course::where('course_id', $assessment->course_id)
            ->where('teacher_id', $teacher->teacher_id)
            ->first();

        if (!$course) {
            return back()->withErrors('Unauthorized');
        }

        // Check if file exists in storage
        if (!Storage::disk('local')->exists($submission->file_path)) {
            return back()->withErrors('File not found');
        }

        return Storage::disk('local')->download($submission->file_path, $submission->file_name);
    }

    public function gradeSubmission(Request $request, $submissionId)
    {
        $request->validate([
            'grade' => 'nullable|numeric|min:0|max:100',
            'feedback' => 'nullable|string|max:2000',
        ]);

        $user = Auth::user();
        $tenantId = $user->tenant_id;

        $submission = AssignmentSubmission::find($submissionId);
        if (!$submission || $submission->tenant_id != $tenantId) {
            return back()->withErrors('Unauthorized');
        }

        // Verify teacher owns the assessment/course
        $assessment = AssessmentFile::find($submission->assessment_id);
        $teacher = Teacher::where('user_id', $user->id)->first();
        $course = Course::where('course_id', $assessment->course_id)
            ->where('teacher_id', $teacher->teacher_id)
            ->first();

        if (!$course) {
            return back()->withErrors('Unauthorized');
        }

        $submission->grade = $request->grade;
        $submission->feedback = $request->feedback;
        $submission->graded_at = now();
        $submission->graded_by = $teacher->teacher_id ?? null;
        $submission->save();

        return back()->with('success', 'Submission graded successfully');
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
