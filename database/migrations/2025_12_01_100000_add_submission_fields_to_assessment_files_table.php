<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assessment_files', function (Blueprint $table) {
            $table->date('submission_deadline')->nullable()->after('description');
            $table->string('submission_link')->nullable()->after('submission_deadline');
        });
    }

    public function down(): void
    {
        Schema::table('assessment_files', function (Blueprint $table) {
            $table->dropColumn(['submission_deadline', 'submission_link']);
        });
    }
};
