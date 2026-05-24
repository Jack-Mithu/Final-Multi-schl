<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;

echo "\n╔═══════════════════════════════════════╗\n";
echo "║   SETUP ADMIN TENANT                  ║\n";
echo "╚═══════════════════════════════════════╝\n\n";

// Get admin user
$admin = User::where('email', 'admin@example.com')->first();

if (!$admin) {
    echo "❌ Admin user not found!\n";
    exit(1);
}

echo "Admin User Found:\n";
echo "  ID: {$admin->id}\n";
echo "  Email: {$admin->email}\n";
echo "  Tenant ID: " . ($admin->tenant_id ?? 'NULL') . "\n\n";

// Check if tenant exists
if ($admin->tenant_id) {
    $tenant = Tenant::where('tenant_id', $admin->tenant_id)->first();
    
    if ($tenant) {
        echo "✅ Tenant exists:\n";
        echo "  Tenant ID: {$tenant->tenant_id}\n";
        echo "  School Name: {$tenant->school_name}\n\n";
        echo "✅ Everything is set up correctly!\n";
    } else {
        echo "⚠️  Tenant ID is set but tenant doesn't exist!\n";
        echo "Creating tenant...\n";
        
        DB::table('tenants')->insert([
            'tenant_id' => $admin->tenant_id,
            'school_name' => 'My School',
            'address' => 'School Address',
        ]);
        
        echo "✅ Tenant created!\n";
    }
} else {
    echo "⚠️  Admin has no tenant_id!\n";
    echo "Setting up tenant...\n\n";
    
    // Create tenant using admin's ID
    DB::table('tenants')->insert([
        'tenant_id' => $admin->id,
        'school_name' => 'My School',
        'address' => 'School Address',
    ]);
    
    // Update admin's tenant_id
    $admin->update(['tenant_id' => $admin->id]);
    
    echo "✅ Tenant created (ID: {$admin->id})\n";
    echo "✅ Admin tenant_id updated\n";
}

echo "\n╔═══════════════════════════════════════╗\n";
echo "║   ✅ SETUP COMPLETE!                  ║\n";
echo "╚═══════════════════════════════════════╝\n\n";

echo "You can now add teachers from the admin panel!\n\n";

