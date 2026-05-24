<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

echo "Assigning roles to users...\n\n";

// Admin
$admin = User::find(1);
if ($admin) {
    if (!$admin->hasRole('admin')) {
        $admin->assignRole('admin');
        echo "✅ Admin role assigned to: {$admin->email}\n";
    } else {
        echo "✓ Admin already has admin role\n";
    }
}

// Teacher
$teacher = User::find(2);
if ($teacher) {
    if (!$teacher->hasRole('teacher')) {
        $teacher->assignRole('teacher');
        echo "✅ Teacher role assigned to: {$teacher->email}\n";
    } else {
        echo "✓ Teacher already has teacher role\n";
    }
}

// Student
$student = User::find(3);
if ($student) {
    if (!$student->hasRole('student')) {
        $student->assignRole('student');
        echo "✅ Student role assigned to: {$student->email}\n";
    } else {
        echo "✓ Student already has student role\n";
    }
}

echo "\n✅ Done! All roles assigned.\n";

