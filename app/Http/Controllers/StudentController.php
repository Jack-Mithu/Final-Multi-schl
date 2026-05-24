<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class StudentController extends Controller
{
    public function index()
    { 
        $tenantId = Auth::user()->tenant_id;
        $students = Student::where('tenant_id', $tenantId)->get();

        return Inertia::render('student/index', [
            'tenant_id' => $tenantId,
            'students' => $students,
        ]);
        
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'grade' => 'required|string|max:50',
        ]);

        try {
            DB::beginTransaction();

            // Create user account
        $user = User::create([
                'name' => $validated['first_name'].' '.$validated['last_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
        'tenant_id' => Auth::user()->tenant_id,
        ]);

            // Ensure student role exists, then assign it
            Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        $user->assignRole('student');

            // Create student record
        Student::create([
            'user_id' => $user->id,
            'tenant_id' => Auth::user()->tenant_id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'grade' => $validated['grade'],
        ]);
        
            DB::commit();

            return Redirect::route('students.index')->with('success', 'Student created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create student: '.$e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'grade' => 'required|string|max:50',
        ]);
        $student = Student::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        $student->update($validated);

        return Redirect::route('students.index');
    }

    public function destroy($id)
    {
        $student = Student::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        $student->delete();

        return Redirect::route('students.index');
    }
}
