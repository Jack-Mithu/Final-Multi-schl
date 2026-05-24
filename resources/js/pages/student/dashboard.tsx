import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { BookOpen, Calendar, Award, TrendingUp, Clock, Download } from 'lucide-react';
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
        title: 'Student Dashboard',
        href: '/student/dashboard',
    },
];

const studentStats = [
    {
        label: 'My Courses',
        icons: BookOpen,
        key: 'enrolledCourses',
        description: 'Courses enrolled',
        color: 'text-blue-500',
    },
    {
        label: 'Timetable',
        icons: Clock,
        key: 'timetableCount',
        description: 'Class schedules',
        color: 'text-purple-500',
    },
    {
        label: 'Grades',
        icons: Award,
        key: 'grades',
        description: 'Average grade',
        color: 'text-yellow-500',
    },

];

interface Enrollment {
    enrollment_id: number;
    course_name: string;
    enrollment_date: string;
}

interface Timetable {
    timetable_id: number;
    course_name: string;
    teacher_name: string;
    day_of_week: string;
    class_date: string;
    start_time: string;
    end_time: string;
    room: string;
}

export default function StudentDashboard() {
    const pageProps = usePage<{
        schoolName?: string;
        enrolledCourses?: number;
        enrollments?: Enrollment[];
        timetables?: Timetable[];
        timetableCount?: number;
        grades?: number;
        progress?: number;
    }>().props;

    const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
    const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
    const enrollments = pageProps.enrollments || [];
    const timetables = pageProps.timetables || [];

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />
            <div className="py-12 min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        {/* Welcome Section */}
                        <div className="mb-6">
                            <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-primary drop-shadow-lg text-left">
                                Welcome, Student! 🎓
                            </h1>
                            {pageProps.schoolName && (
                                <div className="text-xl text-gray-700 dark:text-gray-200 font-semibold text-left mb-2">
                                    <span className="inline-block px-4 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-bold shadow-sm">
                                        {pageProps.schoolName}
                                    </span>
                                </div>
                            )}
                            <div className="h-1 w-24 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full mb-4"></div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {studentStats.map(({ label, icons: Icon, key, description, color }) => {
                                const isMyCourses = label === 'My Courses';
                                const isTimetable = label === 'Timetable';
                                const isGrades = label === 'Grades';
                                return (
                                    <Card
                                        key={label}
                                        className={`transition-all hover:scale-105 hover:shadow-xl border-2 hover:border-primary/30 ${
                                            isMyCourses || isTimetable || isGrades ? 'cursor-pointer' : ''
                                        }`}
                                        onClick={() => {
                                            if (isMyCourses) setIsCoursesModalOpen(true);
                                            if (isTimetable) setIsTimetableModalOpen(true);
                                            if (isGrades) router.get('/student/grades');
                                        }}
                                    >
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                                <Icon className={`w-5 h-5 ${color}`} />
                                                {label}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-3xl font-extrabold mb-1 text-center tracking-tight text-gray-900 dark:text-white drop-shadow">
                                                {(pageProps[key as keyof typeof pageProps] as number) || 0}
                                            </div>
                                            <CardDescription className="text-center text-sm">
                                                {description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Info Card */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <Link href="/student/assessments">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
                                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                        <Download className="w-6 h-6" />
                                        Assessment Files
                                    </h2>
                                    <p className="text-blue-50">
                                        Download assessment materials and study resources shared by your instructors.
                                    </p>
                                </div>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>

            {/* My Courses Modal */}
            <Dialog open={isCoursesModalOpen} onOpenChange={setIsCoursesModalOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <BookOpen className="w-6 h-6 text-blue-500" />
                            My Enrolled Courses
                        </DialogTitle>
                        <DialogDescription>
                            View all courses you are currently enrolled in
                        </DialogDescription>
                    </DialogHeader>

                    {enrollments.length === 0 ? (
                        <div className="py-12 text-center">
                            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Enrolled Courses</h3>
                            <p className="text-muted-foreground">
                                You are not currently enrolled in any courses. Please contact your administrator.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 mt-4">
                            {enrollments.map((enrollment) => (
                                <div
                                    key={enrollment.enrollment_id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-2">
                                                {enrollment.course_name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    Enrolled on: {formatDate(enrollment.enrollment_date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Timetable Modal */}
            <Dialog open={isTimetableModalOpen} onOpenChange={setIsTimetableModalOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <Clock className="w-6 h-6 text-purple-500" />
                            Class Timetable
                        </DialogTitle>
                        <DialogDescription>
                            View the schedule for your enrolled courses with teacher information
                        </DialogDescription>
                    </DialogHeader>

                    {timetables.length === 0 ? (
                        <div className="py-12 text-center">
                            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Timetable Available</h3>
                            <p className="text-muted-foreground">
                                No timetables have been scheduled for your courses yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 mt-4">
                            {timetables.map((timetable) => (
                                <div
                                    key={timetable.timetable_id}
                                    className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <div className="mb-3">
                                        <h3 className="text-lg font-semibold text-primary">
                                            {timetable.course_name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Instructor: <span className="font-medium">{timetable.teacher_name}</span>
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <div className="flex flex-col">
                                                <span className="font-medium">{timetable.day_of_week}</span>
                                                <span className="text-xs text-muted-foreground">{formatDate(timetable.class_date)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">{timetable.start_time} - {timetable.end_time}</span>
                                        </div>
                                        <div className="col-span-2 flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">Room: {timetable.room}</span>
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

