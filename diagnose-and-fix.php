<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "╔══════════════════════════════════════╗\n";
echo "║   TEACHER LOGIN DIAGNOSTIC TOOL      ║\n";
echo "╚══════════════════════════════════════╝\n\n";

// Get teacher
$teacher = User::where('email', 'teacher@example.com')->first();

if (!$teacher) {
    echo "❌ CRITICAL: Teacher user not found!\n";
    exit(1);
}

echo "✅ Teacher found: {$teacher->email}\n";
echo "   ID: {$teacher->id}\n";
echo "   Name: {$teacher->name}\n\n";

// Check roles
echo "━━━ ROLE ANALYSIS ━━━\n";
$roles = $teacher->getRoleNames();
echo "Current roles: ";
if ($roles->isEmpty()) {
    echo "❌ NONE\n";
} else {
    echo $roles->implode(', ') . "\n";
}

$hasAdmin = $teacher->hasRole('admin');
$hasTeacher = $teacher->hasRole('teacher');
$hasStudent = $teacher->hasRole('student');

echo "Has 'admin' role: " . ($hasAdmin ? "❌ YES (WRONG!)" : "✓ NO") . "\n";
echo "Has 'teacher' role: " . ($hasTeacher ? "✓ YES" : "❌ NO (WRONG!)") . "\n";
echo "Has 'student' role: " . ($hasStudent ? "❌ YES (WRONG!)" : "✓ NO") . "\n\n";

// Check database directly
echo "━━━ DATABASE CHECK ━━━\n";
$roleAssignments = DB::table('model_has_roles')
    ->where('model_type', 'App\Models\User')
    ->where('model_id', $teacher->id)
    ->get();

echo "Direct DB entries for teacher:\n";
foreach ($roleAssignments as $assignment) {
    $roleName = DB::table('roles')->where('id', $assignment->role_id)->value('name');
    echo "  - Role ID {$assignment->role_id}: {$roleName}\n";
}
echo "\n";

// Determine what needs fixing
$needsFix = false;
if ($hasAdmin || $hasStudent || !$hasTeacher) {
    $needsFix = true;
    echo "⚠️  PROBLEM DETECTED!\n\n";
    
    if ($hasAdmin) {
        echo "   ❌ Teacher has ADMIN role - this is why they see admin dashboard!\n";
    }
    if ($hasStudent) {
        echo "   ❌ Teacher has STUDENT role - incorrect\n";
    }
    if (!$hasTeacher) {
        echo "   ❌ Teacher does NOT have TEACHER role - incorrect\n";
    }
    
    echo "\n━━━ APPLYING FIX ━━━\n";
    
    // Remove all roles
    DB::table('model_has_roles')
        ->where('model_type', 'App\Models\User')
        ->where('model_id', $teacher->id)
        ->delete();
    echo "✓ Removed all roles\n";
    
    // Add only teacher role
    $teacherRole = DB::table('roles')->where('name', 'teacher')->first();
    if ($teacherRole) {
        $teacher->assignRole('teacher');
        echo "✓ Assigned ONLY teacher role\n";
    } else {
        echo "❌ Teacher role not found in database!\n";
        exit(1);
    }
    
    // Verify
    $teacher = $teacher->fresh();
    $newRoles = $teacher->getRoleNames();
    echo "\n✅ FIX APPLIED!\n";
    echo "New roles: " . $newRoles->implode(', ') . "\n\n";
    
} else {
    echo "✅ ROLES ARE CORRECT!\n\n";
}

// Check redirect logic
echo "━━━ LOGIN REDIRECT TEST ━━━\n";
$teacher = $teacher->fresh();

if ($teacher->hasRole('admin')) {
    echo "❌ Would redirect to: /dashboard (ADMIN)\n";
    echo "   This is WRONG for teacher!\n";
} elseif ($teacher->hasRole('teacher')) {
    echo "✅ Would redirect to: /teacher/dashboard (TEACHER)\n";
    echo "   This is CORRECT!\n";
} elseif ($teacher->hasRole('student')) {
    echo "❌ Would redirect to: /student/dashboard (STUDENT)\n";
    echo "   This is WRONG for teacher!\n";
} else {
    echo "⚠️  Would redirect to: /dashboard (DEFAULT)\n";
    echo "   No role assigned!\n";
}

echo "\n╔══════════════════════════════════════╗\n";
echo "║         NEXT STEPS                   ║\n";
echo "╚══════════════════════════════════════╝\n\n";

if ($needsFix) {
    echo "1. ✅ Roles have been fixed automatically\n";
    echo "2. 🚪 LOGOUT from the website\n";
    echo "3. 🔑 LOGIN again with:\n";
    echo "     Email: teacher@example.com\n";
    echo "     Password: password\n";
    echo "4. ✅ You should see /teacher/dashboard\n";
} else {
    echo "Roles are already correct!\n";
    echo "If you're still seeing admin dashboard:\n";
    echo "1. 🚪 LOGOUT\n";
    echo "2. Run: php artisan optimize:clear\n";
    echo "3. 🔑 LOGIN again\n";
}

echo "\n✨ Done!\n";

