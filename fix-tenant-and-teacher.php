<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Tenant;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;

echo "\n╔═══════════════════════════════════════╗\n";
echo "║   FIX TENANT & TEACHER SETUP          ║\n";
echo "╚═══════════════════════════════════════╝\n\n";

// Step 1: Create tenant if missing
echo "Step 1: Checking tenants...\n";
$tenant = Tenant::where('tenant_id', 1)->first();

if (!$tenant) {
    echo "  ⚠️  No tenant found! Creating default tenant...\n";
    $tenant = Tenant::create([
        'tenant_id' => 1,
        'school_name' => 'Default School',
        'address' => 'School Address',
    ]);
    echo "  ✅ Tenant created (ID: 1, Name: Default School)\n\n";
} else {
    echo "  ✅ Tenant exists (ID: {$tenant->tenant_id}, Name: {$tenant->school_name})\n\n";
}

// Step 2: Check teacher record
echo "Step 2: Checking teacher record...\n";
$teacher = Teacher::find(1);

if ($teacher) {
    echo "  ✅ Teacher found:\n";
    echo "     Name: {$teacher->first_name} {$teacher->last_name}\n";
    echo "     Subject: {$teacher->subject}\n";
    echo "     User ID: {$teacher->user_id}\n";
    echo "     Tenant ID: {$teacher->tenant_id}\n\n";
    
    // Step 3: Check if user exists for this teacher
    echo "Step 3: Checking user account for teacher...\n";
    $user = User::find($teacher->user_id);
    
    if ($user) {
        echo "  ✅ User account exists:\n";
        echo "     Email: {$user->email}\n";
        echo "     Name: {$user->name}\n";
        
        // Check if user has teacher role
        if (!$user->hasRole('teacher')) {
            echo "  ⚠️  User doesn't have teacher role! Assigning...\n";
            $user->assignRole('teacher');
            echo "  ✅ Teacher role assigned\n";
        } else {
            echo "  ✅ User has teacher role\n";
        }
        
        echo "\n╔═══════════════════════════════════════╗\n";
        echo "║   LOGIN CREDENTIALS                   ║\n";
        echo "╚═══════════════════════════════════════╝\n\n";
        echo "Email: {$user->email}\n";
        echo "Password: (use the password you set when creating teacher)\n\n";
        echo "If you forgot the password, you can reset it:\n";
        echo "Run: php artisan tinker\n";
        echo "Then: User::find({$user->id})->update(['password' => Hash::make('newpassword')]);\n\n";
        
    } else {
        echo "  ❌ No user account found for teacher!\n";
        echo "  User ID {$teacher->user_id} doesn't exist.\n";
        echo "  This teacher was created incorrectly.\n\n";
        echo "  Please delete this teacher and create a new one from admin panel.\n";
    }
} else {
    echo "  ℹ️  No teachers found yet.\n";
    echo "  Login as admin and create teachers from the Teachers page.\n\n";
}

echo "═══════════════════════════════════════\n";
echo "✅ Check complete!\n\n";

