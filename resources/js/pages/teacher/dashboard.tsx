import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { Users, BookOpen, Calendar, ClipboardCheck, Clock, FileText, Download } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teacher Dashboard',
        href: '/teacher/dashboard',
    },
];

const teacherStats = [
    {
        label: 'My Students',
        icons: Users,
        key: 'totalStudents',
        description: 'Students in your classes',
        color: 'text-blue-500',
    },
    {
        label: 'My Courses',
        icons: BookOpen,
        key: 'totalCourses',
        description: 'Courses you teach',
        color: 'text-green-500',
    },
    {
        label: 'My Subjects',
        icons: Calendar,
        key: 'totalSubjects',
        description: 'Subjects you handle',
        color: 'text-purple-500',
    },
    {
        label: 'Enrollments',
        icons: ClipboardCheck,
        key: 'totalEnrollments',
        description: 'Total course enrollments',
        color: 'text-orange-500',
    },
];

interface Student {
    student_id: number;
    name: string;
    email: string;
}

interface Course {
    course_id: number;
    course_name: string;
    enrollment_count: number;
}

interface Enrollment {
    enrollment_id: number;
    student_name: string;
    course_name: string;
    enrollment_date: string;
}

interface Submission {
    submission_id: number;
    student_name: string;
    student_email: string;
    file_name: string;
    file_size: string;
    submitted_at: string;
}

interface AssessmentSubmission {
    assessment_id: number;
    assignment_title: string;
    course_name: string;
    submissions: Submission[];
}

export default function TeacherDashboard() {
    const pageProps = usePage().props as any;
    const teacherInfo = pageProps.teacherInfo;
    
    const [openModal, setOpenModal] = useState<string | null>(null);
    const students = pageProps.students || [];
    const courses = pageProps.courses || [];
    const subjects = pageProps.subjects || [];
    const enrollments = pageProps.enrollments || [];
    const submissions = pageProps.submissions || [];

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const handleDownloadSubmission = (submissionId: number) => {
        window.location.href = `/assessments/submissions/${submissionId}/download`;
    };
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher Dashboard" />
            <div className="py-12 min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        {/* Welcome Section */}
                        <div className="mb-6">
                            <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-primary drop-shadow-lg text-left">
                                Welcome, {teacherInfo?.name || 'Teacher'}! 👨‍🏫
                            </h1>
                            {pageProps.schoolName && (
                                <div className="text-xl text-gray-700 dark:text-gray-200 font-semibold text-left mb-2">
                                    <span className="inline-block px-4 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-bold shadow-sm">
                                        {pageProps.schoolName}
                                    </span>
                                </div>
                            )}
                            
                            {/* Teacher Info Cards */}
                            <div className="flex flex-wrap gap-3 mb-3">
                                {teacherInfo?.subject && (
                                    <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold shadow-sm">
                                        📚 Subject: {teacherInfo.subject}
                                    </span>
                                )}
                                {teacherInfo?.email && (
                                    <span className="inline-block px-4 py-1 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold shadow-sm">
                                        ✉️ {teacherInfo.email}
                                    </span>
                                )}
                            </div>
                            
                            <div className="h-1 w-24 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-full mb-4"></div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {teacherStats.map(({ label, icons: Icon, key, description, color }) => (
                                <Card 
                                    key={label} 
                                    className="transition-all hover:scale-105 hover:shadow-xl border-2 hover:border-primary/30 cursor-pointer"
                                    onClick={() => setOpenModal(label)}
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                            <Icon className={`w-5 h-5 ${color}`} />
                                            {label}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-extrabold mb-1 text-center tracking-tight text-gray-900 dark:text-white drop-shadow">
                                            {pageProps[key] || 0}
                                        </div>
                                        <CardDescription className="text-center text-sm">
                                            {description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Link href="/timetables">
                                <Card className="transition-all hover:scale-105 hover:shadow-xl border-2 hover:border-primary/30 cursor-pointer">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="w-6 h-6 text-blue-500" />
                                            Manage Timetable
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            Create and manage your course timetable. View enrolled students for each course.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/assessments">
                                <Card className="transition-all hover:scale-105 hover:shadow-xl border-2 hover:border-primary/30 cursor-pointer">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="w-6 h-6 text-purple-500" />
                                            Assessment Files
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            Upload and manage assessment files for your courses.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
                            
                            <Link href="/teacher/submissions">
                                <Card className="transition-all hover:scale-105 hover:shadow-xl border-2 hover:border-primary/30 cursor-pointer">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Download className="w-6 h-6 text-red-500" />
                                            Student Submissions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            View and download student submissions grouped by course and assessment.
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
                            
                        </div>


                    </div>
                </div>
            </div>

            {/* My Students Modal */}
            <Dialog open={openModal === 'My Students'} onOpenChange={(open) => setOpenModal(open ? 'My Students' : null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <Users className="w-6 h-6 text-blue-500" />
                            My Students
                        </DialogTitle>
                        <DialogDescription>
                            View all students enrolled in your courses
                        </DialogDescription>
                    </DialogHeader>

                    {students.length === 0 ? (
                        <div className="py-12 text-center">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Students</h3>
                            <p className="text-muted-foreground">
                                No students are enrolled in your courses yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 mt-4">
                            {students.map((student: Student) => (
                                <div
                                    key={student.student_id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{student.name}</h3>
                                            <p className="text-sm text-muted-foreground">Email: {student.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* My Courses Modal */}
            <Dialog open={openModal === 'My Courses'} onOpenChange={(open) => setOpenModal(open ? 'My Courses' : null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <BookOpen className="w-6 h-6 text-green-500" />
                            My Courses
                        </DialogTitle>
                        <DialogDescription>
                            View all courses you teach
                        </DialogDescription>
                    </DialogHeader>

                    {courses.length === 0 ? (
                        <div className="py-12 text-center">
                            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Courses</h3>
                            <p className="text-muted-foreground">
                                You are not assigned to any courses yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 mt-4">
                            {courses.map((course: Course) => (
                                <div
                                    key={course.course_id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{course.course_name}</h3>
                                            <p className="text-sm text-muted-foreground">Enrolled Students: {course.enrollment_count}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* My Subjects Modal */}
            <Dialog open={openModal === 'My Subjects'} onOpenChange={(open) => setOpenModal(open ? 'My Subjects' : null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <Calendar className="w-6 h-6 text-purple-500" />
                            My Subjects
                        </DialogTitle>
                        <DialogDescription>
                            View all subjects you teach
                        </DialogDescription>
                    </DialogHeader>

                    {subjects.length === 0 ? (
                        <div className="py-12 text-center">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Subjects</h3>
                            <p className="text-muted-foreground">
                                No subjects assigned to your profile yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 mt-4">
                            {subjects.map((subject: string, index: number) => (
                                <div
                                    key={index}
                                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <h3 className="text-lg font-semibold">{subject}</h3>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Enrollments Modal */}
            <Dialog open={openModal === 'Enrollments'} onOpenChange={(open) => setOpenModal(open ? 'Enrollments' : null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <ClipboardCheck className="w-6 h-6 text-orange-500" />
                            Enrollments
                        </DialogTitle>
                        <DialogDescription>
                            View all student enrollments in your courses
                        </DialogDescription>
                    </DialogHeader>

                    {enrollments.length === 0 ? (
                        <div className="py-12 text-center">
                            <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Enrollments</h3>
                            <p className="text-muted-foreground">
                                No enrollments found for your courses.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 mt-4">
                            {enrollments.map((enrollment: Enrollment) => (
                                <div
                                    key={enrollment.enrollment_id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{enrollment.student_name}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">Course: {enrollment.course_name}</p>
                                            <p className="text-sm text-muted-foreground">Enrolled on: {formatDate(enrollment.enrollment_date)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
