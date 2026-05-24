<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assessment_files', function (Blueprint $table) {
            $table->id('assessment_id');
            $table->unsignedInteger('tenant_id');
            $table->unsignedInteger('course_id');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type');
            $table->unsignedBigInteger('file_size');
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_files');
    }
};
