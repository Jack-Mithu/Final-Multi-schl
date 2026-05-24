import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types';
import { Star, FileText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Grades', href: '/student/grades' },
];

interface AssessmentGrade {
    assessment_id: number;
    title: string;
    grade: number | null;
    feedback: string | null;
}

interface CourseGrades {
    course_id: number;
    course_name: string;
    average_grade: number | null;
    assessments: AssessmentGrade[];
}

export default function StudentGradesPage() {
    const pageProps = usePage().props as any;
    const courses: CourseGrades[] = pageProps.courses || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Grades" />
            <div className="py-12 min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-primary drop-shadow-lg text-left">
                            My Grades 📊
                        </h1>
                        <p className="text-gray-700 dark:text-gray-200 mb-6">
                            View your grades per course and detailed feedback for each assessment.
                        </p>
                    </div>

                    {courses.length === 0 ? (
                        <Card className="border-2">
                            <CardContent className="pt-12 pb-12 text-center">
                                <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-2xl font-semibold mb-2">No Grades Yet</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    You don't have any graded assessments yet. Check back later after instructors grade submissions.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {courses.map((course) => (
                                <Card key={course.course_id} className="border-2">
                                    <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-neutral-800 dark:to-neutral-800 border-b">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-2xl">{course.course_name}</CardTitle>
                                                <CardDescription>
                                                    {course.assessments.length} assessment{course.assessments.length !== 1 ? 's' : ''}
                                                </CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-muted-foreground">Course Average</div>
                                                <div className="text-3xl font-bold text-emerald-600 flex items-center gap-2">
                                                    <Star className="w-5 h-5 text-amber-400" />
                                                    {course.average_grade !== null ? `${course.average_grade}%` : '—'}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {course.assessments.map((a) => (
                                                <div key={a.assessment_id} className="p-3 rounded border">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium">{a.title}</div>
                                                            {a.feedback && (
                                                                <div className="text-sm text-muted-foreground mt-1">Feedback: {a.feedback}</div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm text-muted-foreground">Grade</div>
                                                            <div className="text-lg font-semibold">
                                                                {a.grade !== null ? `${a.grade}%` : 'Not graded'}
                                                            </div>
                                                        </div>
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
