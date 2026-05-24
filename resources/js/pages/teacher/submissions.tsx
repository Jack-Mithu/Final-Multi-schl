import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Download, FileText } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface SubmissionRow {
    submission_id: number;
    student_name: string;
    student_email: string;
    file_name: string;
    file_size: string;
    submitted_at: string;
    grade?: number | null;
    feedback?: string | null;
}

export default function TeacherSubmissionsPage() {
    const pageProps = usePage().props as any;
    const courses = pageProps.courses || [];

    const [gradingId, setGradingId] = useState<number | null>(null);
    const [gradeValue, setGradeValue] = useState<string>('');
    const [feedbackValue, setFeedbackValue] = useState<string>('');

    const handleDownload = (submissionId: number) => {
        window.location.href = `/assessments/submissions/${submissionId}/download`;
    };

    const openGradeModal = (s: SubmissionRow) => {
        setGradingId(s.submission_id);
        setGradeValue(s.grade ? String(s.grade) : '');
        setFeedbackValue(s.feedback || '');
    };

    const submitGrade = async () => {
        if (!gradingId) return;

        router.post(`/assessments/submissions/${gradingId}/grade`, {
            grade: gradeValue === '' ? null : gradeValue,
            feedback: feedbackValue,
        }, {
            onSuccess: () => {
                // refresh to show updated data
                window.location.reload();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Submissions', href: '/teacher/submissions' }]}>
            <Head title="Student Submissions" />

            <div className="py-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold mb-6">Student Submissions</h1>

                    {courses.length === 0 ? (
                        <Card className="border-2">
                            <CardContent className="py-12 text-center">
                                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Courses or Submissions</h3>
                                <p className="text-muted-foreground">You have no courses or there are no submissions yet.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {courses.map((course: any) => (
                                <div key={course.course_id} className="space-y-4">
                                    <h2 className="text-xl font-semibold">{course.course_name}</h2>

                                    {course.assessments.length === 0 ? (
                                        <Card className="border">
                                            <CardContent className="py-6 text-center">No assessments for this course.</CardContent>
                                        </Card>
                                    ) : (
                                        <div className="space-y-4">
                                            {course.assessments.map((assessment: any) => (
                                                <Card key={assessment.assessment_id} className="border">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center justify-between">
                                                            <span>{assessment.title}</span>
                                                            <small className="text-sm text-muted-foreground">{assessment.submissions.length} submissions</small>
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {assessment.submission_deadline ? `Deadline: ${assessment.submission_deadline}` : 'No deadline set'}
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {assessment.submissions.length === 0 ? (
                                                            <div className="py-4 text-center">No submissions yet.</div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {assessment.submissions.map((s: any) => (
                                                                    <div key={s.submission_id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-white dark:bg-neutral-800 rounded">
                                                                        <div className="flex-1 mb-3 md:mb-0">
                                                                            <div className="font-medium">{s.student_name}</div>
                                                                            <div className="text-sm text-muted-foreground">{s.student_email} • {s.submitted_at}</div>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="text-sm text-muted-foreground mr-4">{s.file_name} ({s.file_size})</div>
                                                                            <Button size="sm" onClick={() => handleDownload(s.submission_id)}>
                                                                                <Download className="w-4 h-4 mr-2" />
                                                                                Download
                                                                            </Button>
                                                                            <div className="flex items-center gap-2 ml-2">
                                                                                <input
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    min="0"
                                                                                    max="100"
                                                                                    placeholder="Grade"
                                                                                    defaultValue={s.grade ?? ''}
                                                                                    onChange={(e) => { setGradingId(s.submission_id); setGradeValue(e.target.value); }}
                                                                                    className="w-20 px-2 py-1 border rounded"
                                                                                />
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Feedback"
                                                                                    defaultValue={s.feedback ?? ''}
                                                                                    onChange={(e) => { setGradingId(s.submission_id); setFeedbackValue(e.target.value); }}
                                                                                    className="px-2 py-1 border rounded"
                                                                                />
                                                                                <Button size="sm" onClick={() => submitGrade()}>
                                                                                    Save
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
