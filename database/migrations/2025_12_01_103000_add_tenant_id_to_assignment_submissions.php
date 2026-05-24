<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Schema::table('assignment_submissions', function (Blueprint $table) {
        //     // $table->integer('tenant_id')->after('submission_id');
        //     // $table->index('tenant_id');
        // });
    }

    public function down(): void
    {
        // Schema::table('assignment_submissions', function (Blueprint $table) {
        //     $table->dropIndex('assignment_submissions_tenant_id_index');
        //     $table->dropColumn('tenant_id');
        // });
    }
};
