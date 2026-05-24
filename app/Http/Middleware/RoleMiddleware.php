<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Role;
use App\Models\Tenant;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        // Ensure user is logged in
        if (!Auth::check()) {
            return redirect('/login');
        }

                    // Check if user has the required role
            if (!$request->user()->hasRole($role)) {

                if ($request->user()->hasRole('superadmin')) {
                    return redirect('/superadmin/dashboard');
                }

                if ($request->user()->hasRole('admin')) {
                    return redirect('/dashboard');
                }

                if ($request->user()->hasRole('teacher')) {
                    return redirect('/teacher/dashboard');
                }

                if ($request->user()->hasRole('student')) {
                    return redirect('/student/dashboard');
                }

                abort(403, 'Unauthorized action.');
            }

        return $next($request);
    }
}