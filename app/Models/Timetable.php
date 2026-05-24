<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Timetable extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'timetable_id';

    protected $fillable = [
        'tenant_id',
        'course_id',
        'day_of_week',
        'start_time',
        'end_time',
        'room',
    ];

    /**
     * Get the course that owns the timetable.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
