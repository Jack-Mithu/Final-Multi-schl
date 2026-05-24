<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SuperAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // SuperAdmins are identified by having tenant_id = null
        if (!$user || $user->tenant_id !== null) {
            return redirect('/')->with('error', 'Unauthorized: SuperAdmin access required');
        }

        return $next($request);
    }
}
