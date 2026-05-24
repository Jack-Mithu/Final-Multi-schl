<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$teacher = User::find(2); // Teacher is ID 2

if (!$teacher) {
    echo "❌ Teacher not found!\n";
    exit;
}

echo "=== TEACHER USER INFO ===\n";
echo "Name: {$teacher->name}\n";
echo "Email: {$teacher->email}\n";
echo "Tenant ID: {$teacher->tenant_id}\n\n";

echo "=== ROLES ===\n";
$roles = $teacher->getRoleNames();
foreach ($roles as $role) {
    echo "✓ {$role}\n";
}

if ($roles->isEmpty()) {
    echo "❌ NO ROLES ASSIGNED!\n";
}

echo "\n=== ROLE CHECKS ===\n";
echo "Has admin role: " . ($teacher->hasRole('admin') ? 'YES ❌' : 'NO ✓') . "\n";
echo "Has teacher role: " . ($teacher->hasRole('teacher') ? 'YES ✓' : 'NO ❌') . "\n";
echo "Has student role: " . ($teacher->hasRole('student') ? 'YES ❌' : 'NO ✓') . "\n";

if ($teacher->hasRole('admin')) {
    echo "\n⚠️  WARNING: Teacher has ADMIN role!\n";
    echo "This is why they can access admin dashboard.\n";
    echo "\nFixing...\n";
    $teacher->removeRole('admin');
    echo "✅ Admin role removed!\n";
}

if (!$teacher->hasRole('teacher')) {
    echo "\n⚠️  WARNING: Teacher does NOT have teacher role!\n";
    echo "Assigning teacher role...\n";
    $teacher->assignRole('teacher');
    echo "✅ Teacher role assigned!\n";
}

echo "\n✅ Teacher should now redirect to /teacher/dashboard\n";

