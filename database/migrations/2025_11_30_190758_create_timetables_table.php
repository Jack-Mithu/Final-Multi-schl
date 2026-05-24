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
        Schema::create('timetables', function (Blueprint $table) {
            $table->increments('timetable_id');
            $table->integer('tenant_id');
            $table->integer('course_id');
            $table->string('day_of_week', 20); // Monday, Tuesday, etc.
            $table->time('start_time');
            $table->time('end_time');
            $table->string('room', 100)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timetables');
    }
};
