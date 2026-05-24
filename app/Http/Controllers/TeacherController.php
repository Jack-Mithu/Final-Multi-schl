<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Traits\Toastable;

class TeacherController extends Controller
{

    use Toastable;
    public function index()
    { 
        $tenantId = Auth::user()->tenant_id;
        $teachers = Teacher::where('tenant_id', $tenantId)->get();
        return Inertia::render('teacher/index',[
             'tenant_id'=> $tenantId,
             'teachers'=> $teachers,
        ]);
        
    }

    public function store(Request $request)
    {

            $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'subject' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            ]);
            
          $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']), 
            'tenant_id' => Auth::user()->tenant_id,
        ]);



    $user->assignRole('teacher');

    // Add teacher-specific fields
    $validated['user_id'] = $user->id;
    $validated['tenant_id'] = Auth::user()->tenant_id;

    Teacher::create($validated);

    return $this->toastRedirect('success', 'Teacher created successfully.', 'teachers.index');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'subject' => 'required|string|max:50',
        ]);
        $teacher = Teacher::where('tenant_id',Auth::user()->tenant_id)->findOrFail($id);
        $teacher->update($validated);
        return $this->toastRedirect('success', 'Teacher updated successfully.', 'teachers.index');
    }

    public function destroy($id)
    {
        $teacher = Teacher::where('tenant_id',Auth::user()->tenant_id)->findOrFail($id);
        $teacher->delete();
        return $this->toastRedirect('success', 'Teacher deleted successfully.', 'teachers.index');
    }
}
