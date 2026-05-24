<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::find(46);
if ($user) {
    $user->assignRole('superadmin');
    echo "✓ Superadmin role assigned to: {$user->email}\n";
} else {
    echo "✗ User with id 46 not found\n";
}
