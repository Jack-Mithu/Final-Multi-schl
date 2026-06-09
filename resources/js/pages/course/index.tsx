import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { BookPlus, Pencil, Trash2, Book, X, Search, GraduationCap, ChevronDown } from 'lucide-react';

interface Course {
    course_id: number;
    tenant_id: number;
    course_name: string;
    teacher_id: number;
}

interface Teacher {
    teacher_id: number;
    first_name: string;
    last_name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Courses', href: '/courses' },
];

const emptyForm = {
    course_name: '',
    teacher_id: '',
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
                    maxWidth: '460px',
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

// Accent colors cycling per course row
const courseAccents = [
    { color: '#6366f1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)' },
    { color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.25)' },
    { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
    { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
    { color: '#a855f7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)' },
    { color: '#ec4899', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)' },
];

export default function CourseIndex() {
    const { courses, teachers } = usePage<{ courses?: Course[]; teachers?: Teacher[] }>().props;
    const courseList = courses ?? [];
    const teacherList = teachers ?? [];

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

    const handleOpenEdit = (course: Course) => {
        setForm({
            id: course.course_id,
            course_name: course.course_name,
            teacher_id: String(course.teacher_id),
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
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...form, teacher_id: Number(form.teacher_id) };
        if (isEdit && form.id) {
            router.put(`/courses/${form.id}`, payload, { onSuccess: handleClose });
        } else {
            router.post('/courses', payload, { onSuccess: handleClose });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/courses/${id}`);
        setDeleteConfirm(null);
    };

    const getTeacherName = (teacher_id: number) => {
        const t = teacherList.find(t => Number(t.teacher_id) === Number(teacher_id));
        return t ? `${t.first_name} ${t.last_name}` : 'Unknown';
    };

    const filtered = courseList.filter(c =>
        c.course_name.toLowerCase().includes(search.toLowerCase()) ||
        getTeacherName(c.teacher_id).toLowerCase().includes(search.toLowerCase()) ||
        String(c.course_id).includes(search)
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

                .cp-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #0b0d14;
                    padding: 2rem 1.5rem 3rem;
                    position: relative;
                    overflow: hidden;
                }
                .cp-root::before {
                    content: '';
                    position: fixed;
                    top: -30%; left: -10%;
                    width: 60vw; height: 60vw;
                    background: radial-gradient(ellipse, rgba(14,165,233,0.09) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }
                .cp-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                /* Header */
                .cp-header {
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
                .cp-header.visible { opacity: 1; transform: translateY(0); }

                .cp-eyebrow {
                    font-size: 0.72rem;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #0ea5e9;
                    margin-bottom: 0.45rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .cp-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 22px; height: 2px;
                    background: #0ea5e9;
                    border-radius: 2px;
                }
                .cp-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
                    font-weight: 800;
                    color: #f0f0f8;
                    line-height: 1.08;
                    letter-spacing: -0.03em;
                    margin: 0;
                }
                .cp-title span { color: #0ea5e9; }
                .cp-count { font-size: 0.82rem; color: #4b5563; margin-top: 0.4rem; }

                .cp-add-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1.2rem;
                    background: #0ea5e9;
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
                .cp-add-btn:hover {
                    background: #0284c7;
                    box-shadow: 0 0 24px rgba(14,165,233,0.4);
                    transform: translateY(-1px);
                }

                /* Toolbar */
                .cp-toolbar {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.25rem;
                    flex-wrap: wrap;
                    opacity: 0;
                    transform: translateY(12px);
                    transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
                }
                .cp-toolbar.visible { opacity: 1; transform: translateY(0); }

                .cp-search-wrap {
                    position: relative;
                    flex: 1;
                    min-width: 200px;
                    max-width: 340px;
                }
                .cp-search-wrap svg {
                    position: absolute;
                    left: 12px; top: 50%;
                    transform: translateY(-50%);
                    color: #4b5563;
                    pointer-events: none;
                }
                .cp-search {
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
                .cp-search::placeholder { color: #374151; }
                .cp-search:focus {
                    border-color: rgba(14,165,233,0.4);
                    background: rgba(14,165,233,0.04);
                }

                /* Table card */
                .cp-table-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 20px;
                    overflow: hidden;
                    opacity: 0;
                    transform: translateY(18px);
                    transition: opacity 0.55s ease 0.15s, transform 0.55s ease 0.15s;
                }
                .cp-table-card.visible { opacity: 1; transform: translateY(0); }

                .cp-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
                .cp-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.06); }
                .cp-table th {
                    padding: 0.9rem 1.25rem;
                    text-align: left;
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #4b5563;
                    white-space: nowrap;
                }
                .cp-table tbody tr {
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    transition: background 0.15s;
                }
                .cp-table tbody tr:last-child { border-bottom: none; }
                .cp-table tbody tr:hover { background: rgba(255,255,255,0.03); }
                .cp-table td {
                    padding: 0.85rem 1.25rem;
                    color: #d1d5db;
                    vertical-align: middle;
                }

                /* Course icon */
                .cp-course-cell { display: flex; align-items: center; gap: 0.75rem; }
                .cp-course-icon {
                    width: 34px; height: 34px;
                    border-radius: 10px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .cp-course-name {
                    font-weight: 600;
                    color: #f0f0f8;
                    font-size: 0.88rem;
                }

                .cp-id-badge {
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

                /* Teacher chip */
                .cp-teacher-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 3px 10px 3px 6px;
                    border-radius: 999px;
                    background: rgba(16,185,129,0.08);
                    border: 1px solid rgba(16,185,129,0.18);
                    color: #6ee7b7;
                    font-size: 0.78rem;
                    font-weight: 500;
                }

                /* Actions */
                .cp-action-btn {
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
                .cp-edit-btn {
                    background: rgba(14,165,233,0.08);
                    border-color: rgba(14,165,233,0.2);
                    color: #7dd3fc;
                }
                .cp-edit-btn:hover {
                    background: rgba(14,165,233,0.18);
                    border-color: rgba(14,165,233,0.4);
                    color: #bae6fd;
                }
                .cp-delete-btn {
                    background: rgba(239,68,68,0.07);
                    border-color: rgba(239,68,68,0.18);
                    color: #f87171;
                    margin-left: 0.5rem;
                }
                .cp-delete-btn:hover {
                    background: rgba(239,68,68,0.15);
                    border-color: rgba(239,68,68,0.35);
                }

                /* Empty */
                .cp-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1rem;
                    color: #4b5563;
                    text-align: center;
                    gap: 0.75rem;
                }
                .cp-empty strong { font-family: 'Syne', sans-serif; font-size: 1rem; color: #6b7280; }
                .cp-empty p { font-size: 0.83rem; }

                /* Form */
                .cp-form-field { margin-bottom: 1.1rem; }
                .cp-label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #9ca3af;
                    margin-bottom: 0.45rem;
                    letter-spacing: 0.02em;
                }
                .cp-input {
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
                .cp-input::placeholder { color: #374151; }
                .cp-input:focus {
                    border-color: rgba(14,165,233,0.5);
                    background: rgba(14,165,233,0.04);
                }

                /* Custom select */
                .cp-select-wrap { position: relative; }
                .cp-select-wrap svg {
                    position: absolute;
                    right: 12px; top: 50%;
                    transform: translateY(-50%);
                    color: #4b5563;
                    pointer-events: none;
                }
                .cp-select {
                    width: 100%;
                    padding: 0.6rem 2.2rem 0.6rem 0.9rem;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    color: #f0f0f8;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    outline: none;
                    appearance: none;
                    cursor: pointer;
                    transition: border-color 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .cp-select:focus {
                    border-color: rgba(14,165,233,0.5);
                    background: rgba(14,165,233,0.04);
                }
                .cp-select option { background: #13151f; color: #f0f0f8; }

                .cp-form-section {
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
                .cp-form-section::after {
                    content: '';
                    flex: 1; height: 1px;
                    background: rgba(255,255,255,0.05);
                }
                .cp-form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                    padding-top: 1.25rem;
                    border-top: 1px solid rgba(255,255,255,0.06);
                }
                .cp-cancel-btn {
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
                .cp-cancel-btn:hover { background: rgba(255,255,255,0.08); color: #f0f0f8; }
                .cp-submit-btn {
                    padding: 0.55rem 1.3rem;
                    background: #0ea5e9;
                    border: none;
                    border-radius: 10px;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s, box-shadow 0.2s;
                }
                .cp-submit-btn:hover {
                    background: #0284c7;
                    box-shadow: 0 0 20px rgba(14,165,233,0.35);
                }

                /* Delete confirm */
                .cp-confirm-body {
                    display: flex; flex-direction: column;
                    align-items: center; text-align: center;
                    gap: 0.75rem; padding: 0.5rem 0 0.25rem;
                }
                .cp-confirm-icon {
                    width: 52px; height: 52px;
                    border-radius: 14px;
                    background: rgba(239,68,68,0.1);
                    border: 1px solid rgba(239,68,68,0.2);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 0.25rem;
                }
                .cp-confirm-title {
                    font-family: 'Syne', sans-serif;
                    font-weight: 700; font-size: 1rem; color: #f0f0f8;
                }
                .cp-confirm-desc {
                    font-size: 0.83rem; color: #6b7280;
                    max-width: 260px; line-height: 1.55;
                }
                .cp-confirm-actions {
                    display: flex; gap: 0.75rem;
                    margin-top: 1rem; width: 100%;
                }
                .cp-confirm-actions button { flex: 1; }
                .cp-confirm-del {
                    padding: 0.6rem;
                    background: rgba(239,68,68,0.12);
                    border: 1px solid rgba(239,68,68,0.25);
                    border-radius: 10px;
                    color: #f87171;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem; font-weight: 600;
                    cursor: pointer; transition: all 0.2s;
                }
                .cp-confirm-del:hover {
                    background: rgba(239,68,68,0.22);
                    border-color: rgba(239,68,68,0.4);
                }

                @media (max-width: 640px) {
                    .cp-root { padding: 1.25rem 1rem 2rem; }
                    .cp-table th:nth-child(1), .cp-table td:nth-child(1) { display: none; }
                }
            `}</style>

            <div className="cp-root">
                <div className="cp-inner">

                    {/* Header */}
                    <div className={`cp-header ${mounted ? 'visible' : ''}`}>
                        <div>
                            <div className="cp-eyebrow">Curriculum</div>
                            <h1 className="cp-title">Course <span>Catalogue</span></h1>
                            <p className="cp-count">{courseList.length} course{courseList.length !== 1 ? 's' : ''} available</p>
                        </div>
                        <button className="cp-add-btn" onClick={handleOpenAdd}>
                            <BookPlus size={16} />
                            Add Course
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className={`cp-toolbar ${mounted ? 'visible' : ''}`}>
                        <div className="cp-search-wrap">
                            <Search size={14} />
                            <input
                                className="cp-search"
                                placeholder="Search by course or teacher…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className={`cp-table-card ${mounted ? 'visible' : ''}`}>
                        {filtered.length === 0 ? (
                            <div className="cp-empty">
                                <Book size={38} style={{ color: '#374151' }} />
                                <strong>{search ? 'No results found' : 'No courses yet'}</strong>
                                <p>{search ? 'Try a different search term.' : 'Add your first course to get started.'}</p>
                            </div>
                        ) : (
                            <table className="cp-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Course</th>
                                        <th>Teacher</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((course, i) => {
                                        const accent = courseAccents[i % courseAccents.length];
                                        return (
                                            <tr key={course.course_id}>
                                                <td>
                                                    <span className="cp-id-badge">#{course.course_id}</span>
                                                </td>
                                                <td>
                                                    <div className="cp-course-cell">
                                                        <div
                                                            className="cp-course-icon"
                                                            style={{ background: accent.bg, border: `1px solid ${accent.border}` }}
                                                        >
                                                            <Book size={15} style={{ color: accent.color }} />
                                                        </div>
                                                        <span className="cp-course-name">{course.course_name}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="cp-teacher-chip">
                                                        <GraduationCap size={12} />
                                                        {getTeacherName(course.teacher_id)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="cp-action-btn cp-edit-btn" onClick={() => handleOpenEdit(course)}>
                                                        <Pencil size={12} /> Edit
                                                    </button>
                                                    <button className="cp-action-btn cp-delete-btn" onClick={() => setDeleteConfirm(course.course_id)}>
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
            <Modal open={open} onClose={handleClose} title={isEdit ? 'Update Course' : 'Add Course'}>
                <form onSubmit={handleSubmit}>
                    <div className="cp-form-section">Course details</div>
                    <div className="cp-form-field">
                        <label className="cp-label" htmlFor="course_name">Course Name</label>
                        <input
                            className="cp-input"
                            id="course_name"
                            name="course_name"
                            value={form.course_name}
                            onChange={handleChange}
                            placeholder="e.g. Introduction to Mathematics"
                            required
                        />
                    </div>
                    <div className="cp-form-section">Assignment</div>
                    <div className="cp-form-field">
                        <label className="cp-label" htmlFor="teacher_id">Assigned Teacher</label>
                        <div className="cp-select-wrap">
                            <select
                                className="cp-select"
                                id="teacher_id"
                                name="teacher_id"
                                value={form.teacher_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select a teacher</option>
                                {teacherList.map(teacher => (
                                    <option key={teacher.teacher_id} value={teacher.teacher_id}>
                                        {teacher.first_name} {teacher.last_name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={14} />
                        </div>
                    </div>
                    <div className="cp-form-actions">
                        <button type="button" className="cp-cancel-btn" onClick={handleClose}>Cancel</button>
                        <button type="submit" className="cp-submit-btn">{isEdit ? 'Save Changes' : 'Add Course'}</button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal
                open={deleteConfirm !== null}
                onClose={() => setDeleteConfirm(null)}
                title="Confirm Deletion"
            >
                <div className="cp-confirm-body">
                    <div className="cp-confirm-icon">
                        <Trash2 size={22} style={{ color: '#f87171' }} />
                    </div>
                    <div className="cp-confirm-title">Delete this course?</div>
                    <div className="cp-confirm-desc">
                        This action cannot be undone. The course and all associated enrollments will be permanently removed.
                    </div>
                    <div className="cp-confirm-actions">
                        <button className="cp-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        <button className="cp-confirm-del" onClick={() => deleteConfirm !== null && handleDelete(deleteConfirm)}>
                            Delete Course
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}