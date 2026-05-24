import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { Upload, Trash2, FileText, Download } from 'lucide-react';
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
        title: 'Assessments',
        href: '/assessments',
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
}

interface Course {
    course_id: number;
    course_name: string;
}

export default function AssessmentsPage() {
    const pageProps = usePage().props as any;
    const courses = pageProps.courses || [];
    const assessments = pageProps.assessments || [];

    const { data, setData, post, processing, errors, reset } = useForm({
        course_id: '',
        title: '',
        description: '',
        submission_deadline: '',
        file: null as File | null,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setSelectedFile(file || null);
        setData('file', file || null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('course_id', data.course_id);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('submission_deadline', data.submission_deadline);
        formData.append('file', selectedFile);

        router.post('/assessments', formData, {
            onSuccess: () => {
                reset();
                setSelectedFile(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assessment Management" />
            <div className="py-12 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Upload Section */}
                    <Card className="mb-8 border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-6 h-6 text-blue-500" />
                                Upload Assessment File
                            </CardTitle>
                            <CardDescription>
                                Upload assessment files for your courses. Students enrolled in these courses can download them.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Course <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.course_id}
                                            onChange={(e) => setData('course_id', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-neutral-800 dark:border-neutral-700"
                                            required
                                        >
                                            <option value="">Select a course</option>
                                            {courses.map((course: Course) => (
                                                <option key={course.course_id} value={course.course_id}>
                                                    {course.course_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.course_id && (
                                            <p className="text-red-500 text-sm mt-1">{errors.course_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="e.g., Mid-term Exam"
                                            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-neutral-800 dark:border-neutral-700"
                                            required
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Add any additional information about this assessment..."
                                        rows={3}
                                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Submission Deadline (Optional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.submission_deadline}
                                        onChange={(e) => setData('submission_deadline', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-neutral-800 dark:border-neutral-700"
                                    />
                                    {errors.submission_deadline && (
                                        <p className="text-red-500 text-sm mt-1">{errors.submission_deadline}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        File (Max 50MB) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="file-input"
                                            required
                                        />
                                        <label htmlFor="file-input" className="cursor-pointer block">
                                            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm font-medium">
                                                {selectedFile ? selectedFile.name : 'Click to select or drag and drop'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, etc.
                                            </p>
                                        </label>
                                    </div>
                                    {errors.file && (
                                        <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full"
                                >
                                    {processing ? 'Uploading...' : 'Upload File'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Assessment Files List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-6 h-6 text-purple-500" />
                                Uploaded Assessment Files
                            </CardTitle>
                            <CardDescription>
                                View and manage all assessment files uploaded for your courses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {assessments.length === 0 ? (
                                <div className="py-12 text-center">
                                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No Assessment Files</h3>
                                    <p className="text-muted-foreground">
                                        Upload your first assessment file to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {assessments.map((assessment: AssessmentFile) => (
                                        <div
                                            key={assessment.assessment_id}
                                            className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                                            {assessment.course_name}
                                                        </span>
                                                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                                            {assessment.file_type.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-semibold">{assessment.title}</h3>
                                                    {assessment.description && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {assessment.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                                        <span>{assessment.file_name}</span>
                                                        <span>{assessment.file_size}</span>
                                                        <span>{assessment.created_at}</span>
                                                    </div>
                                                    {assessment.submission_deadline && (
                                                        <div className="mt-2 text-sm">
                                                            <span className="font-medium">Submission Deadline:</span> {new Date(assessment.submission_deadline).toLocaleString()}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this file?')) {
                                                            router.delete(`/assessments/${assessment.assessment_id}`);
                                                        }
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
