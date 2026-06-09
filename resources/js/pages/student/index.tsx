import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { useState, useEffect } from 'react';
import { UserPlus, Pencil, Trash2, Users, X, AlertCircle, Search } from 'lucide-react';

interface Student {
    student_id: number;
    tenant_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    grade: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Students', href: '/students' },
];

const emptyForm = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    grade: '',
};

type FormState = typeof emptyForm & { id?: number };

function Modal({ open, onClose, title, children }: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (open) document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 100,
                background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#13151f',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    width: '100%',
                    maxWidth: '480px',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                    overflow: 'hidden',
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.4rem 1.75rem',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    flexShrink: 0,
                }}>
                    <span style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700, fontSize: '1.1rem',
                        color: '#f0f0f8', letterSpacing: '-0.02em',
                    }}>{title}</span>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8, width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#6b7280', transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#f0f0f8'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'; }}
                    >
                        <X size={15} />
                    </button>
                </div>
                <div style={{ overflowY: 'auto', padding: '1.5rem 1.75rem 1.75rem', flexGrow: 1 }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function StudentIndex() {
    const page = usePage<{ students?: Student[]; errors?: Record<string, string>; error?: string }>();
    const { students, errors, error } = page.props;
    const studentsList = students ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    const handleOpenAdd = () => {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    };

    const handleOpenEdit = (student: Student) => {
        setForm({
            id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            password: student.password,
            grade: String(student.grade),
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
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && form.id) {
            router.put(`/students/${form.id}`, {
                first_name: form.first_name,
                last_name: form.last_name,
                grade: form.grade,
            }, { onSuccess: handleClose });
        } else {
            router.post('/students', {
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
                password: form.password,
                grade: form.grade,
            }, { onSuccess: handleClose });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/students/${id}`);
        setDeleteConfirm(null);
    };

    const filtered = studentsList.filter(s =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        String(s.student_id).includes(search) ||
        String(s.grade).includes(search)
    );

    const initials = (s: Student) =>
        `${s.first_name[0] ?? ''}${s.last_name[0] ?? ''}`.toUpperCase();

    const gradeColor = (grade: number) => {
        if (grade >= 9) return { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' };
        if (grade >= 6) return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' };
        return { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

                .sp-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #0b0d14;
                    padding: 2rem 1.5rem 3rem;
                    position: relative;
                    overflow: hidden;
                }
                .sp-root::before {
                    content: '';
                    position: fixed;
                    top: -30%; left: -10%;
                    width: 60vw; height: 60vw;
                    background: radial-gradient(ellipse, rgba(99,102,241,0.11) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }
                .sp-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                /* Header */
                .sp-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 1.5rem;
                    margin-bottom: 2.4rem;
                    flex-wrap: wrap;
                    opacity: 0;
                    transform: translateY(18px);
                    transition: opacity 0.55s ease, transform 0.55s ease;
                }
                .sp-header.visible { opacity: 1; transform: translateY(0); }

                .sp-eyebrow {
                    font-size: 0.72rem;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #6366f1;
                    margin-bottom: 0.45rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .sp-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 22px; height: 2px;
                    background: #6366f1;
                    border-radius: 2px;
                }
                .sp-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
                    font-weight: 800;
                    color: #f0f0f8;
                    line-height: 1.08;
                    letter-spacing: -0.03em;
                    margin: 0;
                }
                .sp-title span { color: #6366f1; }
                .sp-count {
                    font-size: 0.82rem;
                    color: #4b5563;
                    margin-top: 0.4rem;
                }

                /* Add button */
                .sp-add-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1.2rem;
                    background: #6366f1;
                    border: none;
                    border-radius: 12px;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
                    white-space: nowrap;
                }
                .sp-add-btn:hover {
                    background: #4f46e5;
                    box-shadow: 0 0 24px rgba(99,102,241,0.4);
                    transform: translateY(-1px);
                }

                /* Toolbar */
                .sp-toolbar {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.25rem;
                    flex-wrap: wrap;
                    opacity: 0;
                    transform: translateY(12px);
                    transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
                }
                .sp-toolbar.visible { opacity: 1; transform: translateY(0); }

                .sp-search-wrap {
                    position: relative;
                    flex: 1;
                    min-width: 200px;
                    max-width: 340px;
                }
                .sp-search-wrap svg {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #4b5563;
                    pointer-events: none;
                }
                .sp-search {
                    width: 100%;
                    padding: 0.55rem 0.9rem 0.55rem 2.4rem;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 10px;
                    color: #d1d5db;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                }
                .sp-search::placeholder { color: #374151; }
                .sp-search:focus {
                    border-color: rgba(99,102,241,0.4);
                    background: rgba(99,102,241,0.04);
                }

                /* Table card */
                .sp-table-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 20px;
                    overflow: hidden;
                    opacity: 0;
                    transform: translateY(18px);
                    transition: opacity 0.55s ease 0.15s, transform 0.55s ease 0.15s;
                }
                .sp-table-card.visible { opacity: 1; transform: translateY(0); }

                .sp-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.875rem;
                }
                .sp-table thead tr {
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .sp-table th {
                    padding: 0.9rem 1.25rem;
                    text-align: left;
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #4b5563;
                    white-space: nowrap;
                }
                .sp-table tbody tr {
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    transition: background 0.15s;
                }
                .sp-table tbody tr:last-child { border-bottom: none; }
                .sp-table tbody tr:hover { background: rgba(255,255,255,0.03); }
                .sp-table td {
                    padding: 0.85rem 1.25rem;
                    color: #d1d5db;
                    vertical-align: middle;
                }

                /* Avatar */
                .sp-avatar {
                    width: 34px; height: 34px;
                    border-radius: 10px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Syne', sans-serif;
                    font-size: 0.72rem;
                    font-weight: 700;
                    background: rgba(99,102,241,0.15);
                    border: 1px solid rgba(99,102,241,0.25);
                    color: #a5b4fc;
                    flex-shrink: 0;
                }
                .sp-name-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .sp-name {
                    font-weight: 600;
                    color: #f0f0f8;
                    font-size: 0.88rem;
                }

                /* ID badge */
                .sp-id-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 2px 8px;
                    border-radius: 6px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #6b7280;
                    font-size: 0.78rem;
                    font-family: monospace;
                }

                /* Grade badge */
                .sp-grade-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 3px 10px;
                    border-radius: 999px;
                    font-size: 0.78rem;
                    font-weight: 600;
                }

                /* Action buttons */
                .sp-action-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    padding: 0.38rem 0.75rem;
                    border-radius: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    border: 1px solid;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                .sp-edit-btn {
                    background: rgba(99,102,241,0.08);
                    border-color: rgba(99,102,241,0.2);
                    color: #a5b4fc;
                }
                .sp-edit-btn:hover {
                    background: rgba(99,102,241,0.18);
                    border-color: rgba(99,102,241,0.4);
                    color: #c7d2fe;
                }
                .sp-delete-btn {
                    background: rgba(239,68,68,0.07);
                    border-color: rgba(239,68,68,0.18);
                    color: #f87171;
                    margin-left: 0.5rem;
                }
                .sp-delete-btn:hover {
                    background: rgba(239,68,68,0.15);
                    border-color: rgba(239,68,68,0.35);
                }

                /* Empty state */
                .sp-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1rem;
                    color: #4b5563;
                    text-align: center;
                    gap: 0.75rem;
                }
                .sp-empty strong {
                    font-family: 'Syne', sans-serif;
                    font-size: 1rem;
                    color: #6b7280;
                }
                .sp-empty p { font-size: 0.83rem; }

                /* Form */
                .sp-form-field { margin-bottom: 1.1rem; }
                .sp-label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #9ca3af;
                    margin-bottom: 0.45rem;
                    letter-spacing: 0.02em;
                }
                .sp-input {
                    width: 100%;
                    padding: 0.6rem 0.9rem;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    color: #f0f0f8;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .sp-input::placeholder { color: #374151; }
                .sp-input:focus {
                    border-color: rgba(99,102,241,0.5);
                    background: rgba(99,102,241,0.05);
                }

                .sp-error-banner {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.6rem;
                    background: rgba(239,68,68,0.08);
                    border: 1px solid rgba(239,68,68,0.2);
                    border-radius: 10px;
                    color: #f87171;
                    padding: 0.75rem 1rem;
                    font-size: 0.83rem;
                    margin-bottom: 1rem;
                }

                .sp-form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                    padding-top: 1.25rem;
                    border-top: 1px solid rgba(255,255,255,0.06);
                }
                .sp-cancel-btn {
                    padding: 0.55rem 1.1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    color: #9ca3af;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .sp-cancel-btn:hover {
                    background: rgba(255,255,255,0.08);
                    color: #f0f0f8;
                }
                .sp-submit-btn {
                    padding: 0.55rem 1.3rem;
                    background: #6366f1;
                    border: none;
                    border-radius: 10px;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s, box-shadow 0.2s;
                }
                .sp-submit-btn:hover {
                    background: #4f46e5;
                    box-shadow: 0 0 20px rgba(99,102,241,0.35);
                }

                /* Section divider in form */
                .sp-form-section {
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #374151;
                    margin: 1.25rem 0 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                }
                .sp-form-section::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.05);
                }

                /* Delete confirm modal */
                .sp-confirm-body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 0.75rem;
                    padding: 0.5rem 0 0.25rem;
                }
                .sp-confirm-icon {
                    width: 52px; height: 52px;
                    border-radius: 14px;
                    background: rgba(239,68,68,0.1);
                    border: 1px solid rgba(239,68,68,0.2);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 0.25rem;
                }
                .sp-confirm-title {
                    font-family: 'Syne', sans-serif;
                    font-weight: 700;
                    font-size: 1rem;
                    color: #f0f0f8;
                }
                .sp-confirm-desc {
                    font-size: 0.83rem;
                    color: #6b7280;
                    max-width: 260px;
                    line-height: 1.55;
                }
                .sp-confirm-actions {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: 1rem;
                    width: 100%;
                }
                .sp-confirm-actions button { flex: 1; }
                .sp-confirm-del {
                    padding: 0.6rem;
                    background: rgba(239,68,68,0.12);
                    border: 1px solid rgba(239,68,68,0.25);
                    border-radius: 10px;
                    color: #f87171;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .sp-confirm-del:hover {
                    background: rgba(239,68,68,0.22);
                    border-color: rgba(239,68,68,0.4);
                }

                @media (max-width: 640px) {
                    .sp-root { padding: 1.25rem 1rem 2rem; }
                    .sp-table th:nth-child(1), .sp-table td:nth-child(1) { display: none; }
                }
            `}</style>

            <div className="sp-root">
                <div className="sp-inner">

                    {/* Header */}
                    <div className={`sp-header ${mounted ? 'visible' : ''}`}>
                        <div>
                            <div className="sp-eyebrow">Management</div>
                            <h1 className="sp-title">Student <span>Records</span></h1>
                            <p className="sp-count">{studentsList.length} student{studentsList.length !== 1 ? 's' : ''} enrolled</p>
                        </div>
                        <button className="sp-add-btn" onClick={handleOpenAdd}>
                            <UserPlus size={16} />
                            Add Student
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className={`sp-toolbar ${mounted ? 'visible' : ''}`}>
                        <div className="sp-search-wrap">
                            <Search size={14} />
                            <input
                                className="sp-search"
                                placeholder="Search by name, ID or grade…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className={`sp-table-card ${mounted ? 'visible' : ''}`}>
                        {filtered.length === 0 ? (
                            <div className="sp-empty">
                                <Users size={38} style={{ color: '#374151' }} />
                                <strong>{search ? 'No results found' : 'No students yet'}</strong>
                                <p>{search ? 'Try a different search term.' : 'Add your first student to get started.'}</p>
                            </div>
                        ) : (
                            <table className="sp-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Student</th>
                                        <th>Grade</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(student => {
                                        const gc = gradeColor(student.grade);
                                        return (
                                            <tr key={student.student_id}>
                                                <td>
                                                    <span className="sp-id-badge">#{student.student_id}</span>
                                                </td>
                                                <td>
                                                    <div className="sp-name-cell">
                                                        <div className="sp-avatar">{initials(student)}</div>
                                                        <div>
                                                            <div className="sp-name">{student.first_name} {student.last_name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        className="sp-grade-badge"
                                                        style={{ color: gc.color, background: gc.bg, border: `1px solid ${gc.border}` }}
                                                    >
                                                        Grade {student.grade}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="sp-action-btn sp-edit-btn" onClick={() => handleOpenEdit(student)}>
                                                        <Pencil size={12} /> Edit
                                                    </button>
                                                    <button className="sp-action-btn sp-delete-btn" onClick={() => setDeleteConfirm(student.student_id)}>
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </div>

            {/* Add / Edit Modal */}
            <Modal open={open} onClose={handleClose} title={isEdit ? 'Update Student' : 'Add Student'}>
                {error && (
                    <div className="sp-error-banner">
                        <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="sp-form-section">Personal info</div>
                    <div className="sp-form-field">
                        <label className="sp-label" htmlFor="first_name">First Name</label>
                        <input className="sp-input" id="first_name" name="first_name" value={form.first_name} onChange={handleChange} placeholder="e.g. Alex" required />
                        <InputError message={errors?.first_name} />
                    </div>
                    <div className="sp-form-field">
                        <label className="sp-label" htmlFor="last_name">Last Name</label>
                        <input className="sp-input" id="last_name" name="last_name" value={form.last_name} onChange={handleChange} placeholder="e.g. Johnson" required />
                        <InputError message={errors?.last_name} />
                    </div>
                    {!isEdit && (
                        <>
                            <div className="sp-form-section">Account credentials</div>
                            <div className="sp-form-field">
                                <label className="sp-label" htmlFor="email">Email Address</label>
                                <input className="sp-input" id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@school.edu" required />
                                <InputError message={errors?.email} />
                            </div>
                            <div className="sp-form-field">
                                <label className="sp-label" htmlFor="password">Password</label>
                                <input className="sp-input" id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required minLength={6} />
                                <InputError message={errors?.password} />
                            </div>
                        </>
                    )}
                    <div className="sp-form-section">Academic</div>
                    <div className="sp-form-field">
                        <label className="sp-label" htmlFor="grade">Grade</label>
                        <input className="sp-input" id="grade" name="grade" type="number" value={form.grade} onChange={handleChange} placeholder="e.g. 7" required min={1} />
                        <InputError message={errors?.grade} />
                    </div>
                    <div className="sp-form-actions">
                        <button type="button" className="sp-cancel-btn" onClick={handleClose}>Cancel</button>
                        <button type="submit" className="sp-submit-btn">{isEdit ? 'Save Changes' : 'Add Student'}</button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal
                open={deleteConfirm !== null}
                onClose={() => setDeleteConfirm(null)}
                title="Confirm Deletion"
            >
                <div className="sp-confirm-body">
                    <div className="sp-confirm-icon">
                        <Trash2 size={22} style={{ color: '#f87171' }} />
                    </div>
                    <div className="sp-confirm-title">Delete this student?</div>
                    <div className="sp-confirm-desc">
                        This action cannot be undone. The student's record and all associated data will be permanently removed.
                    </div>
                    <div className="sp-confirm-actions">
                        <button className="sp-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        <button className="sp-confirm-del" onClick={() => deleteConfirm !== null && handleDelete(deleteConfirm)}>
                            Delete Student
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}