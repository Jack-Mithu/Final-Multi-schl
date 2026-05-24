import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage, router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useState, useEffect } from 'react';

interface Student {
    student_id: number;
    tenant_id: number;
    first_name: string;
    last_name: string;
    email:string;
    password:string;
    grade: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: '/students',
    },
];

const emptyForm = {
    first_name: '',
    last_name: '',
    email: '',
    password:'',
    grade: '',
};

type FormState = typeof emptyForm & { id?: number };

export default function StudentIndex() {
    const page = usePage<{ students?: Student[]; errors?: Record<string, string>; error?: string }>();
    const { students, errors, error } = page.props;
    const studentsList = students ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);

    // Close dialog and clear errors when errors are cleared
    useEffect(() => {
        if (!errors || Object.keys(errors).length === 0) {
            if (open && !error) {
                // Only close if there's no error message
                // handleClose will be called on success via onSuccess callback
            }
        }
    }, [errors, error, open]);

    const handleOpenAdd =() => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    };


    const hanndleOpenEdit = (student: Student) => {
        setForm({
            id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
            email:student.email,
            password:student.password,
            grade:String(student.grade),
        });
        setIsEdit(true);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && form.id) {
        // For editing, only send fields that can be updated
        const payload = {
            first_name: form.first_name,
            last_name: form.last_name,
            grade: form.grade,
        };
        router.put(`/students/${form.id}`, payload, {
            onSuccess: handleClose
        });
    } else {
        // For creating, include all required fields including email and password
        const payload = {
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            password: form.password,
            grade: form.grade,
        };
        router.post('/students', payload, {
            onSuccess: handleClose,
            onError: () => {
                // Keep dialog open to show errors
            },
        });
    }
};

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this student?')) {
            router.delete(`/students/${id}`);
        }
    };

    return (
        <AppLayout  breadcrumbs={breadcrumbs}>
            <Card className="p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Students</h1>
                    <Button onClick={handleOpenAdd}>Add Student</Button>
                </div>
                <div>
                    <table className="min-w-full border text-sm rounded-lg">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">ID</th>
                                <th className="px-4 py-2 text-left font-semibold">First Name</th>
                                <th className="px-4 py-2 text-left font-semibold">Last Name</th>
                                <th className="px-4 py-2 text-left font-semibold">Grade</th>
                                <th className="px-4 py-2 text-left font-semibold">Actions</th>
                            </tr>

                        </thead>
                        <tbody>
                            {studentsList.map((student) => (
                                <tr key={student.student_id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700">
                                  <td className="px-4 py-2">{student.student_id}</td>
                                  <td className="px-4 py-2">{student.first_name}</td>
                                  <td className="px-4 py-2">{student.last_name}</td>
                                    <td className="px-4 py-2">{student.grade}</td>
                                    <td className="px-4 py-2">  
                                        <Button variant="outline" size="sm" onClick={() => hanndleOpenEdit(student)}>Edit</Button>
                                        <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDelete(student.student_id)}>Delete</Button></td>
                                </tr>
                            ))}


                        </tbody>
                    </table>
                </div>


            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Update Student' : 'Add Student'}</DialogTitle>
                    </DialogHeader>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div>
                            <Label htmlFor="first_name">First Name</Label>  
                            <Input
                                id="first_name"
                                name="first_name"
                                value={form.first_name}
                                onChange={handleChange}
                                required/>
                            <InputError message={errors?.first_name} />
                        </div>
                        <div>
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                value={form.last_name}
                                onChange={handleChange}
                                required/>
                            <InputError message={errors?.last_name} />
                        </div>
                        {!isEdit && (
                            <>
                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        disabled={isEdit}
                                    />
                                    <InputError message={errors?.email} />
                                </div>
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                    <InputError message={errors?.password} />
                                </div>
                            </>
                        )}
                        <div>
                            <Label htmlFor="grade">Grade</Label>
                            <Input  
                                id="grade"
                                name="grade"
                                type="number"
                                value={form.grade}
                                onChange={handleChange}
                                required min={1}/>
                            <InputError message={errors?.grade} />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button type="submit">{isEdit ? 'Update' : 'Add'}</Button>
                        </div>
                    </form> 
                    </DialogContent>
            </Dialog>



        </AppLayout>

    );
}
            