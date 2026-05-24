<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;

$rows = \App\Models\AssessmentFile::take(50)->get();
foreach ($rows as $a) {
    $local = Storage::disk('local')->exists($a->file_path) ? '1' : '0';
    $private = (config('filesystems.disks.private') && Storage::disk('private')->exists($a->file_path)) ? '1' : '0';
    echo "id={$a->assessment_id} path={$a->file_path} local={$local} private={$private}\n";
}
