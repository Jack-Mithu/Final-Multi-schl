<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::find(46);
echo "User ID: {$user->id}\n";
echo "User Email: {$user->email}\n";
echo "User Tenant ID: " . ($user->tenant_id === null ? 'NULL (SuperAdmin)' : $user->tenant_id) . "\n";
echo "User Roles: " . implode(', ', $user->getRoleNames()->toArray()) . "\n";
echo "Has superadmin role: " . ($user->hasRole('superadmin') ? 'YES' : 'NO') . "\n";
