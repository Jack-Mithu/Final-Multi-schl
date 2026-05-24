<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "=== FIXING TEACHER ROLES ===\n\n";

// Get all users
$users = User::all();

foreach ($users as $user) {
    echo "User: {$user->email}\n";
    $roles = $user->getRoleNames()->toArray();
    echo "Current roles: " . implode(', ', $roles) . "\n";
    
    // Fix based on email
    if (str_contains($user->email, 'admin@')) {
        // Admin should only have admin role
        DB::table('model_has_roles')->where('model_id', $user->id)->delete();
        $user->assignRole('admin');
        echo "✅ Fixed: Now has ONLY admin role\n";
    } elseif (str_contains($user->email, 'teacher@')) {
        // Teacher should only have teacher role
        DB::table('model_has_roles')->where('model_id', $user->id)->delete();
        $user->assignRole('teacher');
        echo "✅ Fixed: Now has ONLY teacher role\n";
    } elseif (str_contains($user->email, 'student@')) {
        // Student should only have student role
        DB::table('model_has_roles')->where('model_id', $user->id)->delete();
        $user->assignRole('student');
        echo "✅ Fixed: Now has ONLY student role\n";
    }
    
    echo "\n";
}

echo "=== VERIFICATION ===\n\n";

$teacher = User::where('email', 'teacher@example.com')->first();
if ($teacher) {
    echo "Teacher roles: " . $teacher->getRoleNames()->implode(', ') . "\n";
    echo "Has admin role: " . ($teacher->hasRole('admin') ? 'YES ❌' : 'NO ✓') . "\n";
    echo "Has teacher role: " . ($teacher->hasRole('teacher') ? 'YES ✓' : 'NO ❌') . "\n";
}

echo "\n✅ ALL FIXED! Now logout and login as teacher.\n";

