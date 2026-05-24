import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Building2,
    Users,
    BookOpen,
    GraduationCap,
    FileText,
    Award,
    ChevronDown,
    Mail,
    MapPin,
    Phone,
} from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'SuperAdmin Dashboard', href: '/superadmin/dashboard' },
];

interface Stat {
    label: string;
    value: number;
    icon: any;
}

interface TenantData {
    tenant_id: number;
    school_name: string;
    address: string;
    phone: string;
    email: string;
    stats: {
        total_students: number;
        total_teachers: number;
        total_courses: number;
        total_enrollments: number;
        total_assessments: number;
        total_submissions: number;
        graded_submissions: number;
    };
    teachers: Array<{
        teacher_id: number;
        name: string;
        email: string;
        subject: string;
    }>;
    courses: Array<{
        course_id: number;
        course_name: string;
        teacher_name: string;
    }>;
    recent_submissions: Array<{
        submission_id: number;
        student_name: string;
        course_name: string;
        file_name: string;
        submitted_at: string;
        grade: number | null;
    }>;
}

export default function SuperAdminDashboard() {
    const pageProps = usePage().props as any;
    const tenants: TenantData[] = pageProps.tenants || [];
    const globalStats = pageProps.global_stats || {};
    const [expandedTenant, setExpandedTenant] = useState<number | null>(null);

    const globalStatCards: Stat[] = [
        {
            label: 'Total Schools',
            value: globalStats.total_tenants || 0,
            icon: Building2,
        },
        {
            label: 'Total Students',
            value: globalStats.total_students || 0,
            icon: Users,
        },
        {
            label: 'Total Teachers',
            value: globalStats.total_teachers || 0,
            icon: GraduationCap,
        },
        {
            label: 'Total Courses',
            value: globalStats.total_courses || 0,
            icon: BookOpen,
        },
        {
            label: 'Total Submissions',
            value: globalStats.total_submissions || 0,
            icon: FileText,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SuperAdmin Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 dark:from-black dark:via-slate-950 dark:to-slate-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-lg backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 md:p-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white md:text-4xl">
                                    SuperAdmin Dashboard
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 md:text-base">
                                    Monitor schools, teachers, students, courses, and academic activity across the
                                    entire platform from one central dashboard.
                                </p>
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                                <Award className="h-4 w-4" />
                                Platform Overview
                            </div>
                        </div>

                        <div className="mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-black" />
                    </div>

                    {/* Global Stats */}
                    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
                        {globalStatCards.map(({ label, value, icon: Icon }) => (
                            <Card
                                key={label}
                                className="group rounded-2xl border border-blue-100 bg-white/90 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90"
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                                {label}
                                            </p>
                                            <p className="text-3xl font-bold tracking-tight text-black dark:text-white">
                                                {value}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-blue-100 p-3 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/50 dark:text-blue-300">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Tenants Section */}
                    {tenants.length === 0 ? (
                        <Card className="rounded-3xl border border-blue-100 bg-white/90 shadow-md dark:border-slate-800 dark:bg-slate-900/90">
                            <CardContent className="py-16 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                                    <Building2 className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-black dark:text-white">No Schools Found</h3>
                                <p className="mx-auto mt-2 max-w-md text-slate-500 dark:text-slate-400">
                                    No tenant schools have been created yet. Once schools are added, they will appear
                                    here with full details and statistics.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {tenants.map((tenant) => {
                                const isExpanded = expandedTenant === tenant.tenant_id;

                                return (
                                    <Card
                                        key={tenant.tenant_id}
                                        className="overflow-hidden rounded-3xl border border-blue-100 bg-white/95 shadow-md transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/95"
                                    >
                                        <CardHeader
                                            className="cursor-pointer border-b border-slate-200 bg-gradient-to-r from-white via-blue-50 to-slate-50 p-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
                                            onClick={() =>
                                                setExpandedTenant(isExpanded ? null : tenant.tenant_id)
                                            }
                                        >
                                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-3 flex items-center gap-3">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                                                            <Building2 className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-2xl font-bold text-black dark:text-white">
                                                                {tenant.school_name}
                                                            </CardTitle>
                                                            <CardDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                                School ID: {tenant.tenant_id}
                                                            </CardDescription>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2 xl:grid-cols-3">
                                                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40">
                                                            <MapPin className="h-4 w-4 text-blue-600" />
                                                            <span>{tenant.address}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40">
                                                            <Phone className="h-4 w-4 text-blue-600" />
                                                            <span>{tenant.phone}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40">
                                                            <Mail className="h-4 w-4 text-blue-600" />
                                                            <span>{tenant.email}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="hidden rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-right dark:border-blue-900 dark:bg-blue-950/30 lg:block">
                                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                            Status
                                                        </p>
                                                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                                            Active School
                                                        </p>
                                                    </div>

                                                    <div
                                                        className={`rounded-xl border border-blue-200 bg-blue-50 p-2 text-blue-700 transition-transform duration-300 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300 ${
                                                            isExpanded ? 'rotate-180' : ''
                                                        }`}
                                                    >
                                                        <ChevronDown className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        {isExpanded && (
                                            <CardContent className="space-y-8 p-6">
                                                {/* School Stats */}
                                                <div>
                                                    <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                                                        School Statistics
                                                    </h3>

                                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
                                                        {[
                                                            { label: 'Students', value: tenant.stats.total_students },
                                                            { label: 'Teachers', value: tenant.stats.total_teachers },
                                                            { label: 'Courses', value: tenant.stats.total_courses },
                                                            { label: 'Enrollments', value: tenant.stats.total_enrollments },
                                                            { label: 'Assessments', value: tenant.stats.total_assessments },
                                                            { label: 'Submissions', value: tenant.stats.total_submissions },
                                                            { label: 'Graded', value: tenant.stats.graded_submissions },
                                                        ].map((item) => (
                                                            <div
                                                                key={item.label}
                                                                className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
                                                            >
                                                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                                                                    {item.value}
                                                                </div>
                                                                <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                    {item.label}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Grid Sections */}
                                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                                                    {/* Teachers */}
                                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                                                        <div className="mb-4 flex items-center justify-between">
                                                            <h3 className="text-lg font-semibold text-black dark:text-white">
                                                                Teachers
                                                            </h3>
                                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                                {tenant.teachers.length}
                                                            </span>
                                                        </div>

                                                        {tenant.teachers.length === 0 ? (
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                No teachers assigned.
                                                            </p>
                                                        ) : (
                                                            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                                                {tenant.teachers.map((teacher) => (
                                                                    <div
                                                                        key={teacher.teacher_id}
                                                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-900"
                                                                    >
                                                                        <p className="font-semibold text-black dark:text-white">
                                                                            {teacher.name}
                                                                        </p>
                                                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                                            {teacher.email}
                                                                        </p>
                                                                        <p className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-300">
                                                                            Subject: {teacher.subject}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Courses */}
                                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                                                        <div className="mb-4 flex items-center justify-between">
                                                            <h3 className="text-lg font-semibold text-black dark:text-white">
                                                                Courses
                                                            </h3>
                                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                                {tenant.courses.length}
                                                            </span>
                                                        </div>

                                                        {tenant.courses.length === 0 ? (
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                No courses available.
                                                            </p>
                                                        ) : (
                                                            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                                                {tenant.courses.map((course) => (
                                                                    <div
                                                                        key={course.course_id}
                                                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-900"
                                                                    >
                                                                        <p className="font-semibold text-black dark:text-white">
                                                                            {course.course_name}
                                                                        </p>
                                                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                                            Teacher: {course.teacher_name}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Recent Submissions */}
                                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
                                                        <div className="mb-4 flex items-center justify-between">
                                                            <h3 className="text-lg font-semibold text-black dark:text-white">
                                                                Recent Submissions
                                                            </h3>
                                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                                {tenant.recent_submissions.length}
                                                            </span>
                                                        </div>

                                                        {tenant.recent_submissions.length === 0 ? (
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                No submissions yet.
                                                            </p>
                                                        ) : (
                                                            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                                                {tenant.recent_submissions.map((sub) => (
                                                                    <div
                                                                        key={sub.submission_id}
                                                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-900"
                                                                    >
                                                                        <div className="flex items-start justify-between gap-4">
                                                                            <div className="flex-1">
                                                                                <p className="font-semibold text-black dark:text-white">
                                                                                    {sub.student_name}
                                                                                </p>
                                                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                                                    {sub.course_name} • {sub.file_name}
                                                                                </p>
                                                                                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                                                                                    Submitted: {sub.submitted_at}
                                                                                </p>
                                                                            </div>

                                                                            <div className="shrink-0">
                                                                                {sub.grade !== null ? (
                                                                                    <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                                                        {sub.grade}%
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                                                        Not graded
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}