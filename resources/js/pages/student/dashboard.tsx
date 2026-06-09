import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { BookOpen, Clock, Award, Download, Calendar, TrendingUp, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Student Dashboard', href: '/student/dashboard' },
];

const studentStats = [
    {
        label: 'My Courses',
        icon: BookOpen,
        key: 'enrolledCourses',
        description: 'Courses enrolled',
        color: '#6366f1',
        bg: 'rgba(99,102,241,0.08)',
        border: 'rgba(99,102,241,0.18)',
        glow: '0 0 32px 0 rgba(99,102,241,0.18)',
        action: 'courses',
    },
    {
        label: 'Timetable',
        icon: Clock,
        key: 'timetableCount',
        description: 'Class schedules',
        color: '#a855f7',
        bg: 'rgba(168,85,247,0.08)',
        border: 'rgba(168,85,247,0.18)',
        glow: '0 0 32px 0 rgba(168,85,247,0.18)',
        action: 'timetable',
    },
    {
        label: 'Grades',
        icon: Award,
        key: 'grades',
        description: 'Average grade',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.18)',
        glow: '0 0 32px 0 rgba(245,158,11,0.18)',
        action: 'grades',
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

function AnimatedNumber({ value }: { value: number }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = value;
        if (end === 0) return;
        const duration = 900;
        const step = Math.ceil(end / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setDisplay(end); clearInterval(timer); }
            else setDisplay(start);
        }, 16);
        return () => clearInterval(timer);
    }, [value]);
    return <>{display.toLocaleString()}</>;
}

function Modal({ open, onClose, title, icon: Icon, iconColor, children }: {
    open: boolean;
    onClose: () => void;
    title: string;
    icon: React.ElementType;
    iconColor: string;
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
                    maxWidth: '600px',
                    maxHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                    overflow: 'hidden',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Modal header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.5rem 1.75rem',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: 10,
                            background: `${iconColor}18`,
                            border: `1px solid ${iconColor}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Icon size={18} style={{ color: iconColor }} />
                        </div>
                        <span style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700, fontSize: '1.15rem',
                            color: '#f0f0f8', letterSpacing: '-0.02em',
                        }}>{title}</span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8, width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#6b7280',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#f0f0f8'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'; }}
                    >
                        <X size={15} />
                    </button>
                </div>
                {/* Modal body */}
                <div style={{ overflowY: 'auto', padding: '1.25rem 1.75rem 1.75rem', flexGrow: 1 }}>
                    {children}
                </div>
            </div>
        </div>
    );
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

    const [mounted, setMounted] = useState(false);
    const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
    const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);

    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    const enrollments = pageProps.enrollments || [];
    const timetables = pageProps.timetables || [];

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
            });
        } catch { return dateString; }
    };

    const handleCardClick = (action: string) => {
        if (action === 'courses') setIsCoursesModalOpen(true);
        else if (action === 'timetable') setIsTimetableModalOpen(true);
        else if (action === 'grades') router.get('/student/grades');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

                .sdash-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #0b0d14;
                    padding: 2rem 1.5rem 3rem;
                    position: relative;
                    overflow: hidden;
                }
                .sdash-root::before {
                    content: '';
                    position: fixed;
                    top: -30%; left: -10%;
                    width: 60vw; height: 60vw;
                    background: radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }
                .sdash-root::after {
                    content: '';
                    position: fixed;
                    bottom: -20%; right: -10%;
                    width: 50vw; height: 50vw;
                    background: radial-gradient(ellipse, rgba(168,85,247,0.09) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }
                .sdash-inner {
                    max-width: 1300px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                /* Header */
                .sdash-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 1.5rem;
                    margin-bottom: 2.8rem;
                    flex-wrap: wrap;
                    opacity: 0;
                    transform: translateY(18px);
                    transition: opacity 0.55s ease, transform 0.55s ease;
                }
                .sdash-header.visible { opacity: 1; transform: translateY(0); }

                .sdash-eyebrow {
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
                .sdash-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 22px; height: 2px;
                    background: #6366f1;
                    border-radius: 2px;
                }
                .sdash-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 800;
                    color: #f0f0f8;
                    line-height: 1.08;
                    letter-spacing: -0.03em;
                    margin: 0;
                }
                .sdash-title span { color: #6366f1; }
                .sdash-subtitle {
                    font-size: 0.93rem;
                    color: #6b7280;
                    margin-top: 0.55rem;
                    max-width: 440px;
                    line-height: 1.6;
                }
                .school-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.55rem 1.1rem;
                    border-radius: 999px;
                    background: rgba(99,102,241,0.1);
                    border: 1px solid rgba(99,102,241,0.25);
                    color: #a5b4fc;
                    font-size: 0.83rem;
                    font-weight: 600;
                    white-space: nowrap;
                }
                .school-badge::before {
                    content: '';
                    width: 7px; height: 7px;
                    border-radius: 50%;
                    background: #6366f1;
                    box-shadow: 0 0 6px 2px rgba(99,102,241,0.5);
                    animation: pulse-dot 2s ease-in-out infinite;
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(0.8); }
                }

                /* Stats grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 1.25rem;
                    margin-bottom: 1.5rem;
                }

                .stat-card {
                    background: rgba(255,255,255,0.035);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 20px;
                    padding: 1.6rem 1.5rem 1.4rem;
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                    opacity: 0;
                    transform: translateY(22px);
                    transition:
                        opacity 0.5s ease,
                        transform 0.5s ease,
                        box-shadow 0.3s ease,
                        border-color 0.3s ease,
                        background 0.3s ease;
                    text-decoration: none;
                }
                .stat-card.visible { opacity: 1; transform: translateY(0); }
                .stat-card:hover {
                    background: rgba(255,255,255,0.055);
                    transform: translateY(-4px) !important;
                    border-color: var(--accent-border-hover);
                }
                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    border-radius: 20px 20px 0 0;
                    background: var(--accent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .stat-card:hover::before { opacity: 1; }

                .stat-glow {
                    position: absolute;
                    top: -40%; right: -20%;
                    width: 130px; height: 130px;
                    border-radius: 50%;
                    background: var(--accent);
                    opacity: 0;
                    filter: blur(48px);
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                }
                .stat-card:hover .stat-glow { opacity: 0.12; }

                .stat-top {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    margin-bottom: 1.3rem;
                }
                .stat-icon-wrap {
                    width: 42px; height: 42px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--accent-bg);
                    border: 1px solid var(--accent-border);
                    transition: background 0.3s, box-shadow 0.3s;
                }
                .stat-card:hover .stat-icon-wrap {
                    background: var(--accent);
                    box-shadow: var(--accent-glow);
                }
                .stat-card:hover .stat-icon-wrap svg { color: #fff !important; }

                .stat-arrow {
                    color: #374151;
                    transition: color 0.3s, transform 0.3s;
                }
                .stat-card:hover .stat-arrow {
                    color: var(--accent);
                    transform: translate(2px, -2px);
                }

                .stat-value {
                    font-family: 'Syne', sans-serif;
                    font-size: 2.4rem;
                    font-weight: 800;
                    color: #f0f0f8;
                    line-height: 1;
                    letter-spacing: -0.03em;
                    margin-bottom: 0.3rem;
                }
                .stat-label {
                    font-size: 0.88rem;
                    font-weight: 600;
                    color: #d1d5db;
                    margin-bottom: 0.15rem;
                }
                .stat-desc { font-size: 0.75rem; color: #4b5563; }

                .stat-bar {
                    margin-top: 1.2rem;
                    height: 3px;
                    background: rgba(255,255,255,0.06);
                    border-radius: 999px;
                    overflow: hidden;
                }
                .stat-bar-fill {
                    height: 100%;
                    border-radius: 999px;
                    background: var(--accent);
                    width: 0%;
                    transition: width 1.1s cubic-bezier(.22,1,.36,1);
                }

                /* Assessment card */
                .action-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.25rem;
                    margin-bottom: 1.5rem;
                }
                .action-card {
                    background: rgba(255,255,255,0.035);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 20px;
                    padding: 1.6rem 1.5rem;
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                    text-decoration: none;
                    display: block;
                    opacity: 0;
                    transform: translateY(22px);
                    transition:
                        opacity 0.5s ease,
                        transform 0.5s ease,
                        background 0.3s ease,
                        border-color 0.3s ease;
                }
                .action-card.visible { opacity: 1; transform: translateY(0); }
                .action-card:hover {
                    background: rgba(255,255,255,0.055);
                    transform: translateY(-4px) !important;
                    border-color: rgba(99,102,241,0.3);
                }
                .action-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    border-radius: 20px 20px 0 0;
                    background: linear-gradient(90deg, #6366f1, #a855f7);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .action-card:hover::before { opacity: 1; }

                .action-card-glow {
                    position: absolute;
                    top: -40%; right: -20%;
                    width: 150px; height: 150px;
                    border-radius: 50%;
                    background: #6366f1;
                    opacity: 0;
                    filter: blur(56px);
                    transition: opacity 0.4s ease;
                    pointer-events: none;
                }
                .action-card:hover .action-card-glow { opacity: 0.1; }

                .action-icon-wrap {
                    width: 44px; height: 44px;
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(99,102,241,0.1);
                    border: 1px solid rgba(99,102,241,0.2);
                    margin-bottom: 1rem;
                    transition: background 0.3s, box-shadow 0.3s;
                }
                .action-card:hover .action-icon-wrap {
                    background: #6366f1;
                    box-shadow: 0 0 20px rgba(99,102,241,0.4);
                }
                .action-card:hover .action-icon-wrap svg { color: #fff !important; }

                .action-title {
                    font-family: 'Syne', sans-serif;
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #f0f0f8;
                    letter-spacing: -0.02em;
                    margin-bottom: 0.35rem;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .action-chevron {
                    color: #374151;
                    transition: color 0.3s, transform 0.3s;
                    margin-left: auto;
                }
                .action-card:hover .action-chevron {
                    color: #6366f1;
                    transform: translateX(3px);
                }
                .action-desc {
                    font-size: 0.82rem;
                    color: #4b5563;
                    line-height: 1.55;
                }

                /* Section label */
                .section-label {
                    font-size: 0.72rem;
                    font-weight: 500;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: #374151;
                    margin-bottom: 1rem;
                    margin-top: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                }
                .section-label::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.05);
                }

                /* Modal internals */
                .modal-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 1rem;
                    color: #4b5563;
                    text-align: center;
                    gap: 0.75rem;
                }
                .modal-empty p { font-size: 0.85rem; line-height: 1.6; max-width: 280px; }

                .modal-item {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 14px;
                    padding: 1.1rem 1.25rem;
                    margin-bottom: 0.75rem;
                    transition: background 0.2s, border-color 0.2s;
                }
                .modal-item:hover {
                    background: rgba(255,255,255,0.055);
                    border-color: rgba(255,255,255,0.12);
                }
                .modal-item:last-child { margin-bottom: 0; }

                .modal-course-name {
                    font-family: 'Syne', sans-serif;
                    font-weight: 700;
                    font-size: 0.97rem;
                    color: #f0f0f8;
                    letter-spacing: -0.01em;
                    margin-bottom: 0.4rem;
                }
                .modal-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.78rem;
                    color: #4b5563;
                }
                .modal-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 2px 8px;
                    border-radius: 999px;
                    background: rgba(99,102,241,0.1);
                    border: 1px solid rgba(99,102,241,0.18);
                    color: #a5b4fc;
                    font-size: 0.72rem;
                    font-weight: 600;
                    margin-bottom: 0.6rem;
                }
                .modal-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem 1rem;
                    margin-top: 0.6rem;
                }
                .modal-grid-item {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.79rem;
                    color: #6b7280;
                }
                .modal-grid-item span { color: #d1d5db; font-weight: 500; }

                @media (max-width: 640px) {
                    .sdash-root { padding: 1.25rem 1rem 2rem; }
                    .stats-grid { grid-template-columns: 1fr 1fr; gap: 0.9rem; }
                    .stat-value { font-size: 1.9rem; }
                    .modal-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="sdash-root">
                <div className="sdash-inner">

                    {/* Header */}
                    <div className={`sdash-header ${mounted ? 'visible' : ''}`}>
                        <div>
                            <div className="sdash-eyebrow">Student Portal</div>
                            <h1 className="sdash-title">Student <span>Dashboard</span></h1>
                            <p className="sdash-subtitle">
                                Track your courses, schedule, and academic progress — all in one place.
                            </p>
                        </div>
                        {pageProps.schoolName && (
                            <div className="school-badge">{pageProps.schoolName}</div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="stats-grid">
                        {studentStats.map(({ label, icon: Icon, key, description, color, bg, border, glow, action }, i) => {
                            const value = (pageProps[key as keyof typeof pageProps] as number) ?? 0;
                            const barWidth = Math.min(100, Math.max(12, (value / 20) * 100));
                            return (
                                <div
                                    key={label}
                                    className={`stat-card ${mounted ? 'visible' : ''}`}
                                    style={{
                                        '--accent': color,
                                        '--accent-bg': bg,
                                        '--accent-border': border,
                                        '--accent-border-hover': border,
                                        '--accent-glow': glow,
                                        transitionDelay: mounted ? `${i * 80}ms` : '0ms',
                                    } as React.CSSProperties}
                                    onClick={() => handleCardClick(action)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => { if (e.key === 'Enter') handleCardClick(action); }}
                                >
                                    <div className="stat-glow" />
                                    <div className="stat-top">
                                        <div className="stat-icon-wrap">
                                            <Icon size={18} style={{ color }} />
                                        </div>
                                        <ChevronRight size={16} className="stat-arrow" />
                                    </div>
                                    <div className="stat-value">
                                        {mounted ? <AnimatedNumber value={value} /> : 0}
                                    </div>
                                    <div className="stat-label">{label}</div>
                                    <div className="stat-desc">{description}</div>
                                    <div className="stat-bar">
                                        <div className="stat-bar-fill" style={{ width: mounted ? `${barWidth}%` : '0%' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Actions */}
                    <div className="section-label">Quick Access</div>
                    <div className="action-grid">
                        <Link
                            href="/student/assessments"
                            className={`action-card ${mounted ? 'visible' : ''}`}
                            style={{ transitionDelay: mounted ? '240ms' : '0ms' }}
                        >
                            <div className="action-card-glow" />
                            <div className="action-icon-wrap">
                                <Download size={18} style={{ color: '#6366f1' }} />
                            </div>
                            <div className="action-title">
                                Assessment Files
                                <ChevronRight size={15} className="action-chevron" />
                            </div>
                            <div className="action-desc">
                                Download materials and study resources shared by your instructors.
                            </div>
                        </Link>
                    </div>

                </div>
            </div>

            {/* My Courses Modal */}
            <Modal
                open={isCoursesModalOpen}
                onClose={() => setIsCoursesModalOpen(false)}
                title="My Enrolled Courses"
                icon={BookOpen}
                iconColor="#6366f1"
            >
                {enrollments.length === 0 ? (
                    <div className="modal-empty">
                        <BookOpen size={36} style={{ color: '#374151' }} />
                        <strong style={{ color: '#6b7280', fontFamily: "'Syne', sans-serif" }}>No courses yet</strong>
                        <p>You're not enrolled in any courses. Contact your administrator to get started.</p>
                    </div>
                ) : (
                    enrollments.map(enrollment => (
                        <div key={enrollment.enrollment_id} className="modal-item">
                            <div className="modal-course-name">{enrollment.course_name}</div>
                            <div className="modal-meta">
                                <Calendar size={12} />
                                Enrolled {formatDate(enrollment.enrollment_date)}
                            </div>
                        </div>
                    ))
                )}
            </Modal>

            {/* Timetable Modal */}
            <Modal
                open={isTimetableModalOpen}
                onClose={() => setIsTimetableModalOpen(false)}
                title="Class Timetable"
                icon={Clock}
                iconColor="#a855f7"
            >
                {timetables.length === 0 ? (
                    <div className="modal-empty">
                        <Clock size={36} style={{ color: '#374151' }} />
                        <strong style={{ color: '#6b7280', fontFamily: "'Syne', sans-serif" }}>No schedule yet</strong>
                        <p>No timetables have been set for your courses. Check back later.</p>
                    </div>
                ) : (
                    timetables.map(timetable => (
                        <div key={timetable.timetable_id} className="modal-item">
                            <div className="modal-tag">
                                <TrendingUp size={10} /> {timetable.day_of_week}
                            </div>
                            <div className="modal-course-name">{timetable.course_name}</div>
                            <div className="modal-grid">
                                <div className="modal-grid-item">
                                    <BookOpen size={12} />
                                    Instructor: <span>{timetable.teacher_name}</span>
                                </div>
                                <div className="modal-grid-item">
                                    <Clock size={12} />
                                    <span>{timetable.start_time} – {timetable.end_time}</span>
                                </div>
                                <div className="modal-grid-item">
                                    <Calendar size={12} />
                                    <span>{formatDate(timetable.class_date)}</span>
                                </div>
                                <div className="modal-grid-item">
                                    <BookOpen size={12} />
                                    Room: <span>{timetable.room}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </Modal>
        </AppLayout>
    );
}