<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Auth;

echo "\n╔═══════════════════════════════════════╗\n";
echo "║   LOGIN REDIRECT DIAGNOSIS            ║\n";
echo "╚═══════════════════════════════════════╝\n\n";

$teacher = User::where('email', 'teacher@example.com')->first();

if (!$teacher) {
    echo "❌ Teacher not found!\n";
    exit(1);
}

echo "Teacher Info:\n";
echo "  ID: {$teacher->id}\n";
echo "  Email: {$teacher->email}\n";
echo "  Name: {$teacher->name}\n\n";

echo "Role Check:\n";
$roles = $teacher->getRoleNames();
echo "  All roles: " . ($roles->isEmpty() ? "NONE" : $roles->implode(', ')) . "\n";
echo "  hasRole('admin'): " . ($teacher->hasRole('admin') ? 'TRUE ❌' : 'FALSE ✓') . "\n";
echo "  hasRole('teacher'): " . ($teacher->hasRole('teacher') ? 'TRUE ✓' : 'FALSE ❌') . "\n";
echo "  hasRole('student'): " . ($teacher->hasRole('student') ? 'TRUE ❌' : 'FALSE ✓') . "\n\n";

echo "Redirect Logic Simulation:\n";
echo "  (Simulating FortifyServiceProvider redirect)\n\n";

// Simulate the exact logic from FortifyServiceProvider
if ($teacher->hasRole('admin')) {
    $redirect = '/dashboard';
    echo "  → Matched: if (\$user->hasRole('admin'))\n";
    echo "  → Redirect: {$redirect} ❌ WRONG!\n";
} elseif ($teacher->hasRole('teacher')) {
    $redirect = '/teacher/dashboard';
    echo "  → Matched: if (\$user->hasRole('teacher'))\n";
    echo "  → Redirect: {$redirect} ✓ CORRECT!\n";
} elseif ($teacher->hasRole('student')) {
    $redirect = '/student/dashboard';
    echo "  → Matched: if (\$user->hasRole('student'))\n";
    echo "  → Redirect: {$redirect} ❌ WRONG!\n";
} else {
    $redirect = '/dashboard';
    echo "  → Matched: else (default)\n";
    echo "  → Redirect: {$redirect} (no role assigned)\n";
}

echo "\n";

// Check config/fortify.php default
$fortifyHome = config('fortify.home');
echo "Fortify Default Home:\n";
echo "  config('fortify.home'): {$fortifyHome}\n\n";

// Check if redirect is actually registered
echo "Checking Fortify Configuration...\n";

if ($redirect === '/teacher/dashboard') {
    echo "✅ REDIRECT SHOULD WORK!\n";
    echo "\nIf you're still seeing /dashboard after login:\n";
    echo "1. The redirect IS configured correctly\n";
    echo "2. But something is overriding it\n";
    echo "\nPossible causes:\n";
    echo "  - Browser cached redirect\n";
    echo "  - Session not actually cleared\n";
    echo "  - Middleware redirecting to /dashboard\n";
} else {
    echo "❌ REDIRECT IS WRONG!\n";
    echo "Teacher will go to: {$redirect}\n";
}

echo "\n";

