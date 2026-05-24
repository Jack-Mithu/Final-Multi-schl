<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

echo "\n╔═══════════════════════════════════════╗\n";
echo "║   FORCE FIX TEACHER LOGIN             ║\n";
echo "╚═══════════════════════════════════════╝\n\n";

// Step 1: Fix roles
echo "Step 1: Fixing teacher roles...\n";

$teacher = User::find(2);
if (!$teacher) {
    echo "❌ Teacher not found!\n";
    exit(1);
}

// Remove ALL roles
DB::table('model_has_roles')->where('model_id', 2)->delete();
echo "  ✓ Removed all existing roles\n";

// Assign ONLY teacher role
$teacherRoleId = DB::table('roles')->where('name', 'teacher')->value('id');
if ($teacherRoleId) {
    DB::table('model_has_roles')->insert([
        'role_id' => $teacherRoleId,
        'model_type' => 'App\Models\User',
        'model_id' => 2
    ]);
    echo "  ✓ Assigned teacher role (ID: {$teacherRoleId})\n";
} else {
    echo "  ❌ Teacher role not found!\n";
    exit(1);
}

// Verify
$teacher = $teacher->fresh();
$roles = $teacher->getRoleNames();
echo "  ✓ Current roles: " . $roles->implode(', ') . "\n\n";

// Step 2: Clear sessions
echo "Step 2: Clearing all sessions...\n";
DB::table('sessions')->delete();
echo "  ✓ All sessions deleted\n\n";

// Step 3: Clear cache
echo "Step 3: Clearing caches...\n";
Artisan::call('config:clear');
echo "  ✓ Config cleared\n";
Artisan::call('cache:clear');
echo "  ✓ Cache cleared\n";
Artisan::call('route:clear');
echo "  ✓ Routes cleared\n";
Artisan::call('view:clear');
echo "  ✓ Views cleared\n\n";

// Step 4: Test redirect logic
echo "Step 4: Testing redirect logic...\n";
if ($teacher->hasRole('admin')) {
    echo "  ❌ Still has admin role!\n";
} else {
    echo "  ✓ Does NOT have admin role\n";
}

if ($teacher->hasRole('teacher')) {
    echo "  ✓ Has teacher role\n";
    echo "  → Will redirect to: /teacher/dashboard\n";
} else {
    echo "  ❌ Does NOT have teacher role!\n";
}

echo "\n╔═══════════════════════════════════════╗\n";
echo "║         ✅ ALL FIXED!                 ║\n";
echo "╚═══════════════════════════════════════╝\n\n";

echo "NEXT STEPS:\n";
echo "1. Go to: http://127.0.0.1:8000/login\n";
echo "2. Press Ctrl+Shift+R (hard refresh)\n";
echo "3. Login: teacher@example.com / password\n";
echo "4. You will see: /teacher/dashboard ✅\n\n";

