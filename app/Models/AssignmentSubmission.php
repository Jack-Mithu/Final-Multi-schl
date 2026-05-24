<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssignmentSubmission extends Model
{
    use HasFactory;

    protected $primaryKey = 'submission_id';
    protected $fillable = [
        'tenant_id',
        'assessment_id',
        'student_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'grade',
        'feedback',
        'graded_at',
        'graded_by',
    ];

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(AssessmentFile::class, 'assessment_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
