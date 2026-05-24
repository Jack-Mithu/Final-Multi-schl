import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

interface Student {
    student_id: number;
    first_name: string;
    last_name: string;
}

interface Enrollment {
    enrollment_id: number;
    student_id: number;
    student?: Student;
}

interface Course {
    course_id: number;
    course_name: string;
    enrollments?: Enrollment[];
}

interface Timetable {
    timetable_id: number;
    course_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room: string | null;
    course?: Course;
}

interface Teacher {
    teacher_id: number;
    first_name: string;
    last_name: string;
    subject: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Timetable',
        href: '/timetables',
    },
];

const emptyForm = {
    course_id: '',
    day_of_week: '',
    start_time: '',
    end_time: '',
    room: '',
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type FormState = typeof emptyForm & { id?: number };

export default function TimetableIndex() {
    const { timetables, courses, teacher } = usePage<{
        timetables?: Timetable[];
        courses?: Course[];
        teacher?: Teacher;
    }>().props;

    const timetableList = timetables ?? [];
    const courseList = courses ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);
    const [expandedTimetable, setExpandedTimetable] = useState<number | null>(null);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (timetable: Timetable) => {
        setForm({
            id: timetable.timetable_id,
            course_id: String(timetable.course_id),
            day_of_week: timetable.day_of_week,
            start_time: timetable.start_time,
            end_time: timetable.end_time,
            room: timetable.room || '',
        });
        setIsEdit(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            course_id: Number(form.course_id),
            day_of_week: form.day_of_week,
            start_time: form.start_time,
            end_time: form.end_time,
            room: form.room || null,
        };

        if (isEdit && form.id) {
            router.put(`/timetables/${form.id}`, payload, {
                onSuccess: handleClose,
            });
        } else {
            router.post('/timetables', payload, {
                onSuccess: handleClose,
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this timetable entry?')) {
            router.delete(`/timetables/${id}`);
        }
    };

    const getCourseName = (courseId: number) => {
        const course = courseList.find((c) => c.course_id === courseId);
        return course ? course.course_name : 'Unknown Course';
    };

    const getEnrolledStudents = (courseId: number) => {
        const course = courseList.find((c) => c.course_id === courseId);
        return course?.enrollments?.map((e) => e.student) || [];
    };

    const toggleExpanded = (timetableId: number) => {
        setExpandedTimetable(expandedTimetable === timetableId ? null : timetableId);
    };

    // Group timetables by day
    const groupedTimetables = timetableList.reduce((acc, timetable) => {
        const day = timetable.day_of_week;
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(timetable);
        return acc;
    }, {} as Record<string, Timetable[]>);

    // Sort days in order
    const sortedDays = daysOfWeek.filter((day) => groupedTimetables[day]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold">My Timetable</h1>
                                {teacher && (
                                    <p className="text-muted-foreground mt-1">
                                        {teacher.first_name} {teacher.last_name} - {teacher.subject}
                                    </p>
                                )}
                            </div>
                            <Button onClick={handleOpenAdd}>Add Timetable Entry</Button>
                        </div>
                    </div>

                    {timetableList.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Timetable Entries</h3>
                                <p className="text-muted-foreground mb-4">
                                    Start by adding timetable entries for your courses.
                                </p>
                                <Button onClick={handleOpenAdd}>Add First Entry</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {sortedDays.map((day) => (
                                <Card key={day}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            {day}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {groupedTimetables[day]
                                                .sort((a, b) => a.start_time.localeCompare(b.start_time))
                                                .map((timetable) => {
                                                    const students = getEnrolledStudents(timetable.course_id);
                                                    const isExpanded = expandedTimetable === timetable.timetable_id;

                                                    return (
                                                        <div
                                                            key={timetable.timetable_id}
                                                            className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-4 mb-2">
                                                                        <h3 className="text-lg font-semibold">
                                                                            {getCourseName(timetable.course_id)}
                                                                        </h3>
                                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                            <Clock className="h-4 w-4" />
                                                                            {timetable.start_time} - {timetable.end_time}
                                                                        </div>
                                                                        {timetable.room && (
                                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                                <MapPin className="h-4 w-4" />
                                                                                {timetable.room}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                                        <span className="font-medium">
                                                                            {students.length} Student{students.length !== 1 ? 's' : ''} Enrolled
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => toggleExpanded(timetable.timetable_id)}
                                                                    >
                                                                        {isExpanded ? 'Hide' : 'Show'} Students
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleOpenEdit(timetable)}
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        onClick={() => handleDelete(timetable.timetable_id)}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            {isExpanded && students.length > 0 && (
                                                                <div className="mt-4 pt-4 border-t">
                                                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                                        <Users className="h-4 w-4" />
                                                                        Enrolled Students:
                                                                    </h4>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                        {students.map((student) => (
                                                                            <div
                                                                                key={student?.student_id}
                                                                                className="p-2 bg-gray-100 dark:bg-neutral-700 rounded text-sm"
                                                                            >
                                                                                {student?.first_name} {student?.last_name}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {isExpanded && students.length === 0 && (
                                                                <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                                                                    No students enrolled in this course yet.
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Update Timetable Entry' : 'Add Timetable Entry'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="course_id">Course</Label>
                            <select
                                id="course_id"
                                name="course_id"
                                value={form.course_id}
                                onChange={handleChange}
                                required
                                className="border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm"
                            >
                                <option value="" disabled>
                                    Select a course
                                </option>
                                {courseList.map((course) => (
                                    <option key={course.course_id} value={course.course_id}>
                                        {course.course_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="day_of_week">Day of Week</Label>
                            <select
                                id="day_of_week"
                                name="day_of_week"
                                value={form.day_of_week}
                                onChange={handleChange}
                                required
                                className="border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm"
                            >
                                <option value="" disabled>
                                    Select a day
                                </option>
                                {daysOfWeek.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="start_time">Start Time</Label>
                                <Input
                                    type="time"
                                    id="start_time"
                                    name="start_time"
                                    value={form.start_time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="end_time">End Time</Label>
                                <Input
                                    type="time"
                                    id="end_time"
                                    name="end_time"
                                    value={form.end_time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="room">Room (Optional)</Label>
                            <Input
                                id="room"
                                name="room"
                                value={form.room}
                                onChange={handleChange}
                                placeholder="e.g., Room 101"
                                maxLength={100}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit">{isEdit ? 'Update' : 'Add'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

