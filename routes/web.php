<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherDashboardController;
use App\Http\Controllers\TimetableController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\StudentAssessmentController;
use App\Http\Controllers\TeacherSubmissionController;
use App\Http\Controllers\SuperAdminDashboardController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'role:superadmin'])->group(function () {
    Route::get('/superadmin/dashboard', [SuperAdminDashboardController::class, 'index'])->name('superadmin.dashboard');
});

Route::middleware(['auth', 'role:admin'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/teachers', [TeacherController::class, 'index'])->name('teachers.index');
    Route::post('/teachers', [TeacherController::class, 'store'])->name('teachers.store');
    Route::put('/teachers/{id}', [TeacherController::class, 'update'])->name('teachers.update');
    Route::delete('/teachers/{id}', [TeacherController::class, 'destroy'])->name('teachers.destroy');

    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
    Route::put('/students/{id}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('/students/{id}', [StudentController::class, 'destroy'])->name('students.destroy');

    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::post('/courses', [CourseController::class, 'store'])->name('courses.store');
    Route::put('/courses/{id}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{id}', [CourseController::class, 'destroy'])->name('courses.destroy');

    Route::get('/enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
    Route::post('/enrollments', [EnrollmentController::class, 'store'])->name('enrollments.store');
    Route::put('/enrollments/{id}', [EnrollmentController::class, 'update'])->name('enrollments.update');
    Route::delete('/enrollments/{id}', [EnrollmentController::class, 'destroy'])->name('enrollments.destroy');

});

Route::middleware(['auth','role:teacher'])->group(function () {

    Route::get('/teacher/dashboard', [TeacherDashboardController::class, 'index'])->name('teacherdash.index');

    Route::get('/timetables', [TimetableController::class, 'index'])->name('timetables.index');
    Route::post('/timetables', [TimetableController::class, 'store'])->name('timetables.store');
    Route::put('/timetables/{id}', [TimetableController::class, 'update'])->name('timetables.update');
    Route::delete('/timetables/{id}', [TimetableController::class, 'destroy'])->name('timetables.destroy');

    Route::get('/assessments', [AssessmentController::class, 'index'])->name('assessments.index');
    Route::post('/assessments', [AssessmentController::class, 'store'])->name('assessments.store');
    Route::delete('/assessments/{id}', [AssessmentController::class, 'destroy'])->name('assessments.destroy');
    Route::get('/assessments/submissions/{submissionId}/download', [AssessmentController::class, 'downloadSubmission'])->name('submissions.download');
    Route::post('/assessments/submissions/{submissionId}/grade', [AssessmentController::class, 'gradeSubmission'])->name('submissions.grade');
    Route::get('/teacher/submissions', [\App\Http\Controllers\TeacherSubmissionController::class, 'index'])->name('teacher.submissions');

});

Route::middleware(['auth', 'role:student'])->group(function () {
    Route::get('/student/dashboard', function () {
        $user = auth()->user();
        $tenantId = $user->tenant_id;

        // Get school name from tenant
        $schoolName = \App\Models\Tenant::where('tenant_id', $tenantId)->value('school_name');

        // Get the student record for the logged-in user
        $student = \App\Models\Student::where('user_id', $user->id)
            ->where('tenant_id', $tenantId)
            ->first();

        // Get enrolled courses with details for this student
        $enrolledCourses = 0;
        $enrollments = [];
        $timetables = [];
        if ($student) {
            $enrollments = \App\Models\Enrollment::where('student_id', $student->student_id)
                ->where('tenant_id', $tenantId)
                ->with('course')
                ->get()
                ->map(function ($enrollment) {
                    return [
                        'enrollment_id' => $enrollment->enrollment_id,
                        'course_name' => $enrollment->course->course_name ?? 'Unknown Course',
                        'enrollment_date' => $enrollment->enrollment_date,
                    ];
                })
                ->toArray();
            $enrolledCourses = count($enrollments);

            // Get timetables for enrolled courses with teacher info
            $courseIds = \App\Models\Enrollment::where('student_id', $student->student_id)
                ->where('tenant_id', $tenantId)
                ->pluck('course_id')
                ->toArray();

            $timetables = \App\Models\Timetable::whereIn('course_id', $courseIds)
                ->where('tenant_id', $tenantId)
                ->with(['course' => function ($query) {
                    $query->with('teacher');
                }])
                ->get()
                ->map(function ($timetable) {
                    // Calculate the next occurrence of the scheduled day
                    $dayName = $timetable->day_of_week;
                    $today = \Carbon\Carbon::now();
                    $dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    $targetDay = array_search($dayName, $dayOfWeek);
                    
                    if ($targetDay !== false) {
                        $currentDay = $today->dayOfWeek;
                        $daysAhead = ($targetDay - $currentDay) % 7;
                        if ($daysAhead <= 0) {
                            $daysAhead += 7;
                        }
                        $classDate = $today->copy()->addDays($daysAhead)->format('Y-m-d');
                    } else {
                        $classDate = $today->format('Y-m-d');
                    }

                    return [
                        'timetable_id' => $timetable->timetable_id,
                        'course_name' => $timetable->course->course_name ?? 'Unknown Course',
                        'teacher_name' => $timetable->course->teacher ? $timetable->course->teacher->first_name . ' ' . $timetable->course->teacher->last_name : 'Unknown Teacher',
                        'day_of_week' => $timetable->day_of_week,
                        'class_date' => $classDate,
                        'start_time' => $timetable->start_time,
                        'end_time' => $timetable->end_time,
                        'room' => $timetable->room,
                    ];
                })
                ->toArray();
        }

        return Inertia::render('student/dashboard', [
            'schoolName' => $schoolName,
            'enrolledCourses' => $enrolledCourses,
            'enrollments' => $enrollments,
            'timetables' => $timetables,
            'timetableCount' => count($timetables),
            'grades' => 0,
            'progress' => 0,
        ]);
    })->name('student.dashboard');

    Route::get('/student/assessments', [StudentAssessmentController::class, 'index'])->name('student.assessments');
    Route::get('/student/assessments/{id}/download', [StudentAssessmentController::class, 'download'])->name('student.assessments.download');
    Route::post('/student/assessments/{id}/submit', [StudentAssessmentController::class, 'submit'])->name('student.assessments.submit');
    Route::get('/student/grades', [StudentAssessmentController::class, 'grades'])->name('student.grades');
});

require __DIR__.'/settings.php';
