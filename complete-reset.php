<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

echo "\n";
echo "═══════════════════════════════════════\n";
echo "   COMPLETE SYSTEM RESET\n";
echo "═══════════════════════════════════════\n\n";

// 1. Delete ALL sessions
echo "1. Deleting ALL sessions...\n";
DB::table('sessions')->delete();
echo "   ✓ All sessions deleted\n\n";

// 2. Fix roles
echo "2. Fixing user roles...\n";
DB::table('model_has_roles')->delete();

$admin = User::find(1);
$teacher = User::find(2);
$student = User::find(3);

if ($admin) {
    $admin->assignRole('admin');
    echo "   ✓ Admin assigned admin role\n";
}

if ($teacher) {
    $teacher->assignRole('teacher');
    echo "   ✓ Teacher assigned teacher role\n";
}

if ($student) {
    $student->assignRole('student');
    echo "   ✓ Student assigned student role\n";
}

echo "\n3. Clearing all caches...\n";
Artisan::call('optimize:clear');
echo "   ✓ All caches cleared\n\n";

echo "4. Verification:\n";
$teacher = User::find(2);
echo "   Teacher roles: " . $teacher->getRoleNames()->implode(', ') . "\n";
echo "   Has admin: " . ($teacher->hasRole('admin') ? 'YES ❌' : 'NO ✓') . "\n";
echo "   Has teacher: " . ($teacher->hasRole('teacher') ? 'YES ✓' : 'NO ❌') . "\n\n";

echo "═══════════════════════════════════════\n";
echo "   ✅ RESET COMPLETE!\n";
echo "═══════════════════════════════════════\n\n";

echo "NOW DO THIS:\n";
echo "1. CLOSE your browser COMPLETELY\n";
echo "2. REOPEN browser\n";
echo "3. Go to: http://127.0.0.1:8000/login\n";
echo "4. Login: teacher@example.com / password\n";
echo "5. URL will be: /teacher/dashboard ✅\n\n";

echo "OR use Incognito mode RIGHT NOW:\n";
echo "1. Press Ctrl+Shift+N\n";
echo "2. Go to: http://127.0.0.1:8000/login\n";
echo "3. Login as teacher\n";
echo "4. Will work immediately!\n\n";

