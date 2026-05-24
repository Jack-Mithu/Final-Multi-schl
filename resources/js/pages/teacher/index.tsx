import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { GraduationCap, Plus, Pencil, Trash2, BookOpen, Mail, Search } from 'lucide-react';

interface Teacher {
    teacher_id: number;
    tenant_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    subject: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Teachers', href: '/teachers' }];
const emptyForm = { first_name: '', last_name: '', subject: '', email: '', password: '' };
type FormState = typeof emptyForm & { id?: number };

const ACCENT_COLORS = [
    '#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899',
    '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4', '#a855f7',
];

function getInitials(first: string, last: string) {
    return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

export default function TeacherIndex() {
    const { teachers } = usePage<{ teachers: Teacher[] }>().props;
    const teacherList = teachers ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);
    const [search, setSearch] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const filtered = teacherList.filter(t =>
        `${t.first_name} ${t.last_name} ${t.subject} ${t.email}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleOpenAdd = () => { setForm(emptyForm); setIsEdit(false); setOpen(true); };
    const handleOpenEdit = (t: Teacher) => {
        setForm({ id: t.teacher_id, first_name: t.first_name, last_name: t.last_name, subject: t.subject, email: t.email, password: t.password });
        setIsEdit(true);
        setOpen(true);
    };
    const handleClose = () => { setOpen(false); setForm(emptyForm); setIsEdit(false); };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && form.id) {
            router.put(`/teachers/${form.id}`, form, { onSuccess: handleClose });
        } else {
            router.post('/teachers', form, { onSuccess: handleClose });
        }
    };
    const handleDelete = (id: number) => {
        setDeleteId(null);
        router.delete(`/teachers/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

                .t-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #0b0d14;
                    padding: 2rem 1.5rem 3rem;
                    position: relative;
                    overflow: hidden;
                }
                .t-root::before {
                    content: '';
                    position: fixed;
                    top: -20%;
                    right: -10%;
                    width: 55vw; height: 55vw;
                    background: radial-gradient(ellipse, rgba(16,185,129,0.09) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }
                .t-root::after {
                    content: '';
                    position: fixed;
                    bottom: -20%;
                    left: -10%;
                    width: 45vw; height: 45vw;
                    background: radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }
                .t-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

                /* Header */
                .t-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 1rem;
                    margin-bottom: 2.2rem;
                    flex-wrap: wrap;
                }
                .t-eyebrow {
                    font-size: 0.72rem;
                    font-weight: 500;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #10b981;
                    margin-bottom: 0.4rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .t-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 22px; height: 2px;
                    background: #10b981;
                    border-radius: 2px;
                }
                .t-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(1.8rem, 3.5vw, 2.6rem);
                    font-weight: 800;
                    color: #f0f0f8;
                    line-height: 1.08;
                    letter-spacing: -0.03em;
                    margin: 0;
                }
                .t-title span { color: #10b981; }

                /* Add Button */
                .add-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1.3rem;
                    border-radius: 12px;
                    background: #10b981;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
                    box-shadow: 0 0 0 0 rgba(16,185,129,0);
                }
                .add-btn:hover {
                    background: #059669;
                    box-shadow: 0 0 24px 0 rgba(16,185,129,0.35);
                    transform: translateY(-1px);
                }

                /* Search bar */
                .search-wrap {
                    position: relative;
                    margin-bottom: 1.8rem;
                }
                .search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #4b5563;
                    pointer-events: none;
                }
                .search-input {
                    width: 100%;
                    max-width: 360px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    padding: 0.65rem 1rem 0.65rem 2.6rem;
                    color: #d1d5db;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                }
                .search-input::placeholder { color: #4b5563; }
                .search-input:focus {
                    border-color: rgba(16,185,129,0.4);
                    background: rgba(16,185,129,0.04);
                }

                /* Stats strip */
                .stats-strip {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.8rem;
                    flex-wrap: wrap;
                }
                .strip-stat {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    font-size: 0.82rem;
                    color: #9ca3af;
                }
                .strip-stat strong { color: #f0f0f8; font-family: 'Syne', sans-serif; }

                /* Card grid */
                .teacher-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 1.1rem;
                }

                .teacher-card {
                    background: rgba(255,255,255,0.035);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 18px;
                    padding: 1.4rem;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
                }
                .teacher-card:hover {
                    transform: translateY(-3px);
                    border-color: rgba(255,255,255,0.13);
                    box-shadow: 0 12px 40px rgba(0,0,0,0.35);
                }
                .teacher-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: var(--c);
                    border-radius: 18px 18px 0 0;
                    opacity: 0.7;
                }
                .card-glow {
                    position: absolute;
                    top: -50%; right: -30%;
                    width: 120px; height: 120px;
                    border-radius: 50%;
                    background: var(--c);
                    opacity: 0.06;
                    filter: blur(40px);
                    pointer-events: none;
                }

                .card-top {
                    display: flex;
                    align-items: center;
                    gap: 0.9rem;
                    margin-bottom: 1rem;
                }
                .avatar {
                    width: 46px; height: 46px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Syne', sans-serif;
                    font-size: 1rem;
                    font-weight: 700;
                    color: #fff;
                    background: var(--c);
                    flex-shrink: 0;
                    opacity: 0.9;
                }
                .card-name {
                    font-family: 'Syne', sans-serif;
                    font-size: 1rem;
                    font-weight: 700;
                    color: #f0f0f8;
                    line-height: 1.2;
                }
                .card-id {
                    font-size: 0.72rem;
                    color: #4b5563;
                    margin-top: 2px;
                }

                .card-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.45rem;
                    margin-bottom: 1.1rem;
                }
                .card-info-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: #6b7280;
                }
                .card-info-row svg { flex-shrink: 0; opacity: 0.6; }
                .card-info-row span { color: #9ca3af; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

                .subject-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 0.28rem 0.7rem;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.09);
                    font-size: 0.73rem;
                    font-weight: 600;
                    color: #d1d5db;
                    margin-bottom: 1.1rem;
                }

                .card-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .action-btn {
                    flex: 1;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.35rem;
                    padding: 0.45rem 0;
                    border-radius: 10px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid;
                    font-family: 'DM Sans', sans-serif;
                }
                .edit-btn {
                    background: rgba(99,102,241,0.1);
                    border-color: rgba(99,102,241,0.2);
                    color: #a5b4fc;
                }
                .edit-btn:hover {
                    background: rgba(99,102,241,0.2);
                    border-color: rgba(99,102,241,0.4);
                }
                .del-btn {
                    background: rgba(239,68,68,0.08);
                    border-color: rgba(239,68,68,0.15);
                    color: #fca5a5;
                }
                .del-btn:hover {
                    background: rgba(239,68,68,0.18);
                    border-color: rgba(239,68,68,0.35);
                }

                /* Empty state */
                .empty-state {
                    text-align: center;
                    padding: 4rem 1rem;
                    color: #4b5563;
                }
                .empty-state svg { margin: 0 auto 1rem; opacity: 0.25; }
                .empty-state h3 { font-family: 'Syne', sans-serif; color: #6b7280; font-size: 1.1rem; }

                /* Modal */
                .modal-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,0.7);
                    backdrop-filter: blur(6px);
                    z-index: 50;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                .modal-box {
                    background: #13161f;
                    border: 1px solid rgba(255,255,255,0.09);
                    border-radius: 22px;
                    padding: 2rem;
                    width: 100%;
                    max-width: 460px;
                    position: relative;
                    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
                }
                .modal-title {
                    font-family: 'Syne', sans-serif;
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #f0f0f8;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                }
                .modal-title svg { color: #10b981; }

                .field-group { margin-bottom: 1rem; }
                .field-label {
                    display: block;
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: #6b7280;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 0.4rem;
                }
                .field-input {
                    width: 100%;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 10px;
                    padding: 0.6rem 0.85rem;
                    color: #d1d5db;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.88rem;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .field-input:focus {
                    border-color: rgba(16,185,129,0.45);
                    background: rgba(16,185,129,0.04);
                }
                .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

                .modal-actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 1.5rem; }
                .cancel-btn {
                    padding: 0.55rem 1.2rem;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.09);
                    color: #9ca3af;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    transition: background 0.2s;
                }
                .cancel-btn:hover { background: rgba(255,255,255,0.09); }
                .submit-btn {
                    padding: 0.55rem 1.4rem;
                    border-radius: 10px;
                    background: #10b981;
                    border: none;
                    color: #fff;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    transition: background 0.2s, box-shadow 0.2s;
                }
                .submit-btn:hover { background: #059669; box-shadow: 0 0 20px rgba(16,185,129,0.3); }

                /* Confirm delete modal */
                .confirm-box {
                    background: #13161f;
                    border: 1px solid rgba(239,68,68,0.2);
                    border-radius: 18px;
                    padding: 1.8rem;
                    width: 100%;
                    max-width: 360px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
                }
                .confirm-icon {
                    width: 52px; height: 52px;
                    border-radius: 50%;
                    background: rgba(239,68,68,0.1);
                    border: 1px solid rgba(239,68,68,0.2);
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 1rem;
                    color: #f87171;
                }
                .confirm-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; color: #f0f0f8; margin-bottom: 0.5rem; }
                .confirm-desc { font-size: 0.83rem; color: #6b7280; margin-bottom: 1.4rem; line-height: 1.6; }
                .confirm-actions { display: flex; gap: 0.6rem; justify-content: center; }
                .confirm-del-btn {
                    padding: 0.5rem 1.3rem;
                    border-radius: 10px;
                    background: #ef4444;
                    border: none;
                    color: #fff;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    transition: background 0.2s;
                }
                .confirm-del-btn:hover { background: #dc2626; }

                @media (max-width: 640px) {
                    .teacher-grid { grid-template-columns: 1fr; }
                    .field-row { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="t-root">
                <div className="t-inner">

                    {/* Header */}
                    <div className="t-header">
                        <div>
                            <div className="t-eyebrow">Management</div>
                            <h1 className="t-title">Teaching <span>Staff</span></h1>
                        </div>
                        <button className="add-btn" onClick={handleOpenAdd}>
                            <Plus size={15} /> Add Teacher
                        </button>
                    </div>

                    {/* Search + Stats */}
                    <div className="search-wrap">
                        <Search size={15} className="search-icon" />
                        <input
                            className="search-input"
                            placeholder="Search teachers…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="stats-strip">
                        <div className="strip-stat">
                            <GraduationCap size={14} />
                            <strong>{teacherList.length}</strong> Total Teachers
                        </div>
                        {search && (
                            <div className="strip-stat">
                                <Search size={14} />
                                <strong>{filtered.length}</strong> results for "{search}"
                            </div>
                        )}
                    </div>

                    {/* Cards Grid */}
                    {filtered.length === 0 ? (
                        <div className="empty-state">
                            <GraduationCap size={48} />
                            <h3>{search ? 'No teachers match your search' : 'No teachers yet'}</h3>
                            <p style={{ fontSize: '0.83rem', marginTop: '0.4rem' }}>
                                {search ? 'Try a different keyword.' : 'Click "Add Teacher" to get started.'}
                            </p>
                        </div>
                    ) : (
                        <div className="teacher-grid">
                            {filtered.map((teacher, i) => {
                                const color = ACCENT_COLORS[teacher.teacher_id % ACCENT_COLORS.length];
                                return (
                                    <div
                                        key={teacher.teacher_id}
                                        className="teacher-card"
                                        style={{ '--c': color } as React.CSSProperties}
                                    >
                                        <div className="card-glow" />
                                        <div className="card-top">
                                            <div className="avatar"
                                                style={{ background: color }}>
                                                {getInitials(teacher.first_name, teacher.last_name)}
                                            </div>
                                            <div>
                                                <div className="card-name">{teacher.first_name} {teacher.last_name}</div>
                                                <div className="card-id">ID #{teacher.teacher_id}</div>
                                            </div>
                                        </div>

                                        <div className="subject-badge">
                                            <BookOpen size={11} /> {teacher.subject}
                                        </div>

                                        <div className="card-info">
                                            <div className="card-info-row">
                                                <Mail size={13} />
                                                <span>{teacher.email}</span>
                                            </div>
                                        </div>

                                        <div className="card-actions">
                                            <button className="action-btn edit-btn" onClick={() => handleOpenEdit(teacher)}>
                                                <Pencil size={13} /> Edit
                                            </button>
                                            <button className="action-btn del-btn" onClick={() => setDeleteId(teacher.teacher_id)}>
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Add / Edit Modal */}
            {open && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && handleClose()}>
                    <div className="modal-box">
                        <div className="modal-title">
                            <GraduationCap size={20} />
                            {isEdit ? 'Update Teacher' : 'Add New Teacher'}
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="field-row">
                                <div className="field-group">
                                    <label className="field-label">First Name</label>
                                    <input className="field-input" name="first_name" value={form.first_name} onChange={handleChange} required placeholder="John" />
                                </div>
                                <div className="field-group">
                                    <label className="field-label">Last Name</label>
                                    <input className="field-input" name="last_name" value={form.last_name} onChange={handleChange} required placeholder="Smith" />
                                </div>
                            </div>
                            <div className="field-group">
                                <label className="field-label">Email Address</label>
                                <input className="field-input" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john.smith@school.edu" />
                            </div>
                            <div className="field-group">
                                <label className="field-label">Password</label>
                                <input className="field-input" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••" />
                            </div>
                            <div className="field-group">
                                <label className="field-label">Subject</label>
                                <input className="field-input" name="subject" value={form.subject} onChange={handleChange} required placeholder="e.g. Mathematics" />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={handleClose}>Cancel</button>
                                <button type="submit" className="submit-btn">
                                    {isEdit ? 'Save Changes' : 'Add Teacher'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {deleteId !== null && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteId(null)}>
                    <div className="confirm-box">
                        <div className="confirm-icon"><Trash2 size={22} /></div>
                        <div className="confirm-title">Delete Teacher?</div>
                        <div className="confirm-desc">
                            This will permanently remove the teacher and all their data. This action cannot be undone.
                        </div>
                        <div className="confirm-actions">
                            <button className="cancel-btn" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="confirm-del-btn" onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}