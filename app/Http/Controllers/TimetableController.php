<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\Timetable;
use App\Models\Course;
use App\Models\Teacher;
use App\Http\Requests\StoreTimetableRequest;

class TimetableController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;
        
        // Get the teacher record for the logged-in user
        $teacher = Teacher::where('user_id', $user->id)->first();
        
        if (!$teacher) {
            return Redirect::route('teacherdash.index')->with('error', 'Teacher profile not found.');
        }
        
        // Get courses taught by this teacher
        $courses = Course::where('tenant_id', $tenantId)
            ->where('teacher_id', $teacher->teacher_id)
            ->with(['timetables', 'enrollments.student'])
            ->get();
        
        // Get all timetables for this teacher's courses
        $courseIds = $courses->pluck('course_id')->toArray();
        $timetables = Timetable::where('tenant_id', $tenantId)
            ->whereIn('course_id', $courseIds)
            ->with(['course.enrollments.student'])
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
        
        return Inertia::render('timetable/index', [
            'timetables' => $timetables,
            'courses' => $courses,
            'teacher' => [
                'teacher_id' => $teacher->teacher_id,
                'first_name' => $teacher->first_name,
                'last_name' => $teacher->last_name,
                'subject' => $teacher->subject,
            ],
        ]);
    }

    public function store(StoreTimetableRequest $request)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;
        
        // Get the teacher record for the logged-in user
        $teacher = Teacher::where('user_id', $user->id)->first();
        
        if (!$teacher) {
            return Redirect::route('teacherdash.index')->with('error', 'Teacher profile not found.');
        }
        
        $validated = $request->validated();
        
        // Verify the course belongs to this teacher
        $course = Course::where('tenant_id', $tenantId)
            ->where('course_id', $validated['course_id'])
            ->where('teacher_id', $teacher->teacher_id)
            ->firstOrFail();
        
        $validated['tenant_id'] = $tenantId;
        
        Timetable::create($validated);
        
        return Redirect::route('timetables.index')->with('success', 'Timetable entry created successfully.');
    }

    public function update(StoreTimetableRequest $request, $id)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;
        
        // Get the teacher record for the logged-in user
        $teacher = Teacher::where('user_id', $user->id)->first();
        
        if (!$teacher) {
            return Redirect::route('teacherdash.index')->with('error', 'Teacher profile not found.');
        }
        
        $validated = $request->validated();
        $timetable = Timetable::where('tenant_id', $tenantId)->findOrFail($id);
        
        // Verify the course belongs to this teacher
        $course = Course::where('tenant_id', $tenantId)
            ->where('course_id', $validated['course_id'])
            ->where('teacher_id', $teacher->teacher_id)
            ->firstOrFail();
        
        $timetable->update($validated);
        
        return Redirect::route('timetables.index')->with('success', 'Timetable entry updated successfully.');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;
        
        // Get the teacher record for the logged-in user
        $teacher = Teacher::where('user_id', $user->id)->first();
        
        if (!$teacher) {
            return Redirect::route('teacherdash.index')->with('error', 'Teacher profile not found.');
        }
        
        $timetable = Timetable::where('tenant_id', $tenantId)
            ->with('course')
            ->findOrFail($id);
        
        // Verify the timetable's course belongs to this teacher
        if ($timetable->course && $timetable->course->teacher_id !== $teacher->teacher_id) {
            return Redirect::route('timetables.index')->with('error', 'You do not have permission to delete this timetable entry.');
        }
        
        $timetable->delete();
        
        return Redirect::route('timetables.index')->with('success', 'Timetable entry deleted successfully.');
    }
}
