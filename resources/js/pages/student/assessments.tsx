import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { Download, FileText, Calendar, Upload } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Assessment Files',
        href: '/student/assessments',
    },
];

interface AssessmentFile {
    assessment_id: number;
    course_name: string;
    title: string;
    description: string;
    file_name: string;
    file_type: string;
    file_size: string;
    created_at: string;
    submission_deadline?: string | null;
    user_submission?: {
        submission_id: number;
        file_name: string;
        file_size: string;
        submitted_at: string;
    } | null;
}

export default function StudentAssessmentsPage() {
    const pageProps = usePage().props as any;
    const assessments = pageProps.assessments || [];
    const enrolledCourses = pageProps.enrolledCourses || 0;

    const [submittingId, setSubmittingId] = useState<number | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<Map<number, File>>(new Map());

    const handleDownload = (assessmentId: number) => {
        // Use a full page navigation so the browser can handle file download responses
        window.location.href = `/student/assessments/${assessmentId}/download`;
    };

    const handleFileChange = (assessmentId: number, file: File | null) => {
        const newFiles = new Map(selectedFiles);
        if (file) {
            newFiles.set(assessmentId, file);
        } else {
            newFiles.delete(assessmentId);
        }
        setSelectedFiles(newFiles);
    };

    const handleSubmit = (assessment: AssessmentFile) => {
        const file = selectedFiles.get(assessment.assessment_id);
        if (!file) {
            alert('Please select a file to submit');
            return;
        }

        setSubmittingId(assessment.assessment_id);
        const formData = new FormData();
        formData.append('file', file);

        router.post(`/student/assessments/${assessment.assessment_id}/submit`, formData, {
            onFinish: () => {
                setSubmittingId(null);
                const newFiles = new Map(selectedFiles);
                newFiles.delete(assessment.assessment_id);
                setSelectedFiles(newFiles);
            },
        });
    };

    const isDeadlineExpired = (deadline: string | null | undefined): boolean => {
        if (!deadline) return false;
        return new Date(deadline) < new Date();
    };

    // Group assessments by course
    const assessmentsByCourse = assessments.reduce((acc: any, assessment: AssessmentFile) => {
        const courseName = assessment.course_name;
        if (!acc[courseName]) {
            acc[courseName] = [];
        }
        acc[courseName].push(assessment);
        return acc;
    }, {});

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assessment Files" />
            <div className="py-12 min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-primary drop-shadow-lg text-left">
                            Assessment Files 📄
                        </h1>
                        <p className="text-gray-700 dark:text-gray-200 mb-6">
                            Download assessment materials shared by your instructors for your enrolled courses.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-purple-500 mb-2">
                                            {enrolledCourses}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-blue-500 mb-2">
                                            {assessments.length}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Assessment Files</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-green-500 mb-2">
                                            {Object.keys(assessmentsByCourse).length}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Courses with Materials</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Assessment Files */}
                    {assessments.length === 0 ? (
                        <Card className="border-2">
                            <CardContent className="pt-12 pb-12 text-center">
                                <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-2xl font-semibold mb-2">No Assessment Files Available</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Your instructors haven't uploaded any assessment files yet. Check back later for course materials.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(assessmentsByCourse).map(([courseName, courseAssessments]: [string, any]) => (
                                <Card key={courseName} className="border-2">
                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-neutral-800 dark:to-neutral-800 border-b">
                                        <CardTitle className="text-2xl">{courseName}</CardTitle>
                                        <CardDescription>
                                            {courseAssessments.length} assessment file{courseAssessments.length !== 1 ? 's' : ''}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            {courseAssessments.map((assessment: AssessmentFile) => (
                                                <div
                                                    key={assessment.assessment_id}
                                                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="inline-block px-3 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-medium">
                                                                    {assessment.file_type.toUpperCase()}
                                                                </span>
                                                                <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                                                    {assessment.file_size}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-lg font-semibold mb-1">{assessment.title}</h3>
                                                            {assessment.description && (
                                                                <p className="text-sm text-muted-foreground mb-3">
                                                                    {assessment.description}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                                                <div className="flex items-center gap-1">
                                                                    <FileText className="w-4 h-4" />
                                                                    <span>{assessment.file_name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span>{assessment.created_at}</span>
                                                                </div>
                                                            </div>

                                                            {/* Submission Deadline and Status */}
                                                            {assessment.submission_deadline && (
                                                                <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                                        <span className="font-medium text-blue-900 dark:text-blue-300">Submission Deadline:</span>
                                                                    </div>
                                                                    <div className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                                                                        {new Date(assessment.submission_deadline).toLocaleString()}
                                                                        {isDeadlineExpired(assessment.submission_deadline) && (
                                                                            <span className="ml-2 text-red-600 dark:text-red-400 font-semibold">(Deadline Passed)</span>
                                                                        )}
                                                                    </div>

                                                                    {/* Existing Submission */}
                                                                    {assessment.user_submission ? (
                                                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                                                                            <p className="text-sm font-medium text-green-900 dark:text-green-300 mb-1">
                                                                                ✓ Submitted
                                                                            </p>
                                                                            <p className="text-xs text-green-800 dark:text-green-200">
                                                                                {assessment.user_submission.file_name} ({assessment.user_submission.file_size})
                                                                            </p>
                                                                            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                                                                Submitted: {assessment.user_submission.submitted_at}
                                                                            </p>
                                                                        </div>
                                                                    ) : (
                                                                        /* Submission Form */
                                                                        !isDeadlineExpired(assessment.submission_deadline) && (
                                                                            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded">
                                                                                <label className="block text-sm font-medium text-orange-900 dark:text-orange-300 mb-2">
                                                                                    Submit Your Assignment:
                                                                                </label>
                                                                                <div className="flex items-center gap-2">
                                                                                    <input
                                                                                        type="file"
                                                                                        onChange={(e) => handleFileChange(assessment.assessment_id, e.target.files?.[0] || null)}
                                                                                        className="flex-1 text-sm"
                                                                                        disabled={submittingId === assessment.assessment_id}
                                                                                    />
                                                                                    <Button
                                                                                        onClick={() => handleSubmit(assessment)}
                                                                                        disabled={submittingId === assessment.assessment_id || !selectedFiles.has(assessment.assessment_id)}
                                                                                        size="sm"
                                                                                    >
                                                                                        {submittingId === assessment.assessment_id ? 'Submitting...' : 'Submit'}
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Button
                                                            onClick={() => handleDownload(assessment.assessment_id)}
                                                            className="ml-4 flex-shrink-0"
                                                        >
                                                            <Download className="w-4 h-4 mr-2" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
