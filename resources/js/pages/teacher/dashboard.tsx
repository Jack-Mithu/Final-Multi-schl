import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { Users, BookOpen, Calendar, ClipboardCheck, Clock, FileText, Download, GraduationCap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';

// Premium Dark Teacher Dashboard (redesigned)
// Generated from existing dashboard structure

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Teacher Dashboard', href: '/teacher/dashboard' },
];

export default function TeacherDashboard() {
    const pageProps = usePage().props as any;
    const teacherInfo = pageProps.teacherInfo;
    const [openModal, setOpenModal] = useState<string | null>(null);

    const stats = [
        { label: 'My Students', value: pageProps.totalStudents || 0, icon: Users },
        { label: 'My Courses', value: pageProps.totalCourses || 0, icon: BookOpen },
        { label: 'My Subjects', value: pageProps.totalSubjects || 0, icon: Calendar },
        { label: 'Enrollments', value: pageProps.totalEnrollments || 0, icon: ClipboardCheck },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher Dashboard" />

            <div className="min-h-screen bg-[#0b0d14] text-white p-8">
                <div className="max-w-7xl mx-auto">

                    <div className="mb-10">
                        <div className="uppercase tracking-[0.2em] text-emerald-500 text-xs mb-2">
                            Teacher Portal
                        </div>

                        <h1 className="text-5xl font-bold mb-3">
                            Welcome <span className="text-emerald-500">{teacherInfo?.name || 'Teacher'}</span>
                        </h1>

                        <div className="flex flex-wrap gap-3 mt-4">
                            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                📚 {teacherInfo?.subject || 'No Subject'}
                            </div>

                            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                ✉️ {teacherInfo?.email || 'No Email'}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                        {stats.map((s) => {
                            const Icon = s.icon;
                            return (
                                <div
                                    key={s.label}
                                    onClick={() => setOpenModal(s.label)}
                                    className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:-translate-y-1 transition"
                                >
                                    <Icon className="w-8 h-8 text-emerald-500 mb-4" />
                                    <div className="text-3xl font-bold">{s.value}</div>
                                    <div className="text-gray-400 mt-1">{s.label}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Link href="/timetables">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:-translate-y-1 transition">
                                <Clock className="w-10 h-10 text-sky-400 mb-4" />
                                <h3 className="font-semibold text-xl mb-2">Manage Timetable</h3>
                                <p className="text-gray-400">Create and manage course schedules.</p>
                            </div>
                        </Link>

                        <Link href="/assessments">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:-translate-y-1 transition">
                                <FileText className="w-10 h-10 text-purple-400 mb-4" />
                                <h3 className="font-semibold text-xl mb-2">Assessment Files</h3>
                                <p className="text-gray-400">Upload and manage assessments.</p>
                            </div>
                        </Link>

                        <Link href="/teacher/submissions">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:-translate-y-1 transition">
                                <Download className="w-10 h-10 text-red-400 mb-4" />
                                <h3 className="font-semibold text-xl mb-2">Student Submissions</h3>
                                <p className="text-gray-400">Review submitted work.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <Dialog open={!!openModal} onOpenChange={() => setOpenModal(null)}>
                <DialogContent className="bg-[#13161f] text-white border-white/10">
                    <DialogHeader>
                        <DialogTitle>{openModal}</DialogTitle>
                        <DialogDescription>
                            Premium dark modal placeholder for {openModal}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 rounded-xl border border-white/10 bg-white/[0.03]">
                        <GraduationCap className="mb-3 text-emerald-500" />
                        Connect your existing modal content here.
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
