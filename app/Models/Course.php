<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
     use HasFactory;
       
     public $timestamps = false;
     protected $primaryKey = 'course_id';
        protected $fillable = [
        'tenant_id',
        'course_name',
        'teacher_id',
    ];

    /**
     * Get the teacher that owns the course.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    /**
     * Get the timetables for the course.
     */
    public function timetables(): HasMany
    {
        return $this->hasMany(Timetable::class, 'course_id');
    }

    /**
     * Get the enrollments for the course.
     */
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'course_id');
    }
}
