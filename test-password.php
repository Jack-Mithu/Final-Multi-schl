<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$teacher = User::where('email', 'teacher@example.com')->first();

if (!$teacher) {
    echo "❌ Teacher user NOT FOUND!\n";
    echo "Run: php artisan db:seed\n";
    exit;
}

echo "✅ Teacher found!\n";
echo "Email: {$teacher->email}\n";
echo "Name: {$teacher->name}\n";
echo "Tenant ID: {$teacher->tenant_id}\n";
echo "\n";

// Test password
$testPassword = 'password';
if (Hash::check($testPassword, $teacher->password)) {
    echo "✅ Password 'password' is CORRECT!\n";
} else {
    echo "❌ Password 'password' is WRONG!\n";
    echo "Hashed password in DB: {$teacher->password}\n";
}

echo "\n";

// Check role
if ($teacher->hasRole('teacher')) {
    echo "✅ Has 'teacher' role!\n";
} else {
    echo "❌ Does NOT have 'teacher' role!\n";
    echo "Assigning role now...\n";
    $teacher->assignRole('teacher');
    echo "✅ Role assigned!\n";
}

