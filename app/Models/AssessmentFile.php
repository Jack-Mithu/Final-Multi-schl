<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentFile extends Model
{
    use HasFactory;

    public $timestamps = true;
    protected $primaryKey = 'assessment_id';

    protected $fillable = [
        'tenant_id',
        'course_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'title',
        'description',
        'submission_deadline',
    ];

    public function submissions()
    {
        return $this->hasMany(\App\Models\AssignmentSubmission::class, 'assessment_id');
    }

    /**
     * Get the course that owns the assessment file.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
