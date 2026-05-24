import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Users, Book, GraduationCap, BookOpen, ListChecks, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

const stats = [
    {
        label: 'Students',
        icon: Users,
        key: 'totalStudents',
        description: 'Total enrolled students',
        color: '#6366f1',
        bg: 'rgba(99,102,241,0.08)',
        border: 'rgba(99,102,241,0.18)',
        glow: '0 0 32px 0 rgba(99,102,241,0.18)',
    },
    {
        label: 'Courses',
        icon: Book,
        key: 'totalCourses',
        description: 'Active courses offered',
        color: '#0ea5e9',
        bg: 'rgba(14,165,233,0.08)',
        border: 'rgba(14,165,233,0.18)',
        glow: '0 0 32px 0 rgba(14,165,233,0.18)',
    },
    {
        label: 'Teachers',
        icon: GraduationCap,
        key: 'totalTeachers',
        description: 'Teaching staff',
        color: '#10b981',
        bg: 'rgba(16,185,129,0.08)',
        border: 'rgba(16,185,129,0.18)',
        glow: '0 0 32px 0 rgba(16,185,129,0.18)',
    },
    {
        label: 'Subjects',
        icon: BookOpen,
        key: 'totalSubjects',
        description: 'Available subjects',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.18)',
        glow: '0 0 32px 0 rgba(245,158,11,0.18)',
    },
    {
        label: 'Enrollments',
        icon: ListChecks,
        key: 'totalEnrollments',
        description: 'Course enrollments',
        color: '#ec4899',
        bg: 'rgba(236,72,153,0.08)',
        border: 'rgba(236,72,153,0.18)',
        glow: '0 0 32px 0 rgba(236,72,153,0.18)',
    },
];

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

export default function Dashboard() {
    const pageProps = usePage().props as any;
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

                .dash-root {
                    font-family: 'DM Sans', sans-serif;
                    min-height: 100vh;
                    background: #0b0d14;
                    padding: 2rem 1.5rem 3rem;
                    position: relative;
                    overflow: hidden;
                }
                .dash-root::before {
                    content: '';
                    position: fixed;
                    top: -30%;
                    left: -10%;
                    width: 60vw;
                    height: 60vw;
                    background: radial-gradient(ellipse, rgba(99,102,241,0.13) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 0;
                }
                .dash-root::after {
                    content: '';
                    position: fixed;
                    bottom: -20%;
                    right: -10%;
                    width: 50vw;
                    height: 50vw;
                    background: radial-gradient(ellipse, rgba(14,165,233,0.10) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 0;
                }
                .dash-inner {
                    max-width: 1300px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                /* Header */
                .dash-header {
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
                .dash-header.visible { opacity: 1; transform: translateY(0); }

                .dash-eyebrow {
                    font-family: 'DM Sans', sans-serif;
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
                .dash-eyebrow::before {
                    content: '';
                    display: inline-block;
                    width: 22px;
                    height: 2px;
                    background: #6366f1;
                    border-radius: 2px;
                }
                .dash-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 800;
                    color: #f0f0f8;
                    line-height: 1.08;
                    letter-spacing: -0.03em;
                    margin: 0;
                }
                .dash-title span { color: #6366f1; }
                .dash-subtitle {
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
                    letter-spacing: 0.01em;
                    white-space: nowrap;
                }
                .school-badge::before {
                    content: '';
                    width: 7px;
                    height: 7px;
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
                }

                .stat-card {
                    background: rgba(255,255,255,0.035);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 20px;
                    padding: 1.6rem 1.5rem 1.4rem;
                    position: relative;
                    overflow: hidden;
                    cursor: default;
                    opacity: 0;
                    transform: translateY(22px);
                    transition:
                        opacity 0.5s ease,
                        transform 0.5s ease,
                        box-shadow 0.3s ease,
                        border-color 0.3s ease,
                        background 0.3s ease;
                }
                .stat-card.visible { opacity: 1; transform: translateY(0); }
                .stat-card:hover {
                    background: rgba(255,255,255,0.055);
                    transform: translateY(-4px) !important;
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
                    top: -40%;
                    right: -20%;
                    width: 130px;
                    height: 130px;
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
                    width: 42px;
                    height: 42px;
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

                .stat-trend {
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: #10b981;
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    background: rgba(16,185,129,0.1);
                    padding: 3px 8px;
                    border-radius: 999px;
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
                .stat-desc {
                    font-size: 0.75rem;
                    color: #4b5563;
                }

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

                @media (max-width: 640px) {
                    .dash-root { padding: 1.25rem 1rem 2rem; }
                    .stats-grid { grid-template-columns: 1fr 1fr; gap: 0.9rem; }
                    .stat-value { font-size: 1.9rem; }
                }
            `}</style>

            <div className="dash-root">
                <div className="dash-inner">

                    {/* Header */}
                    <div className={`dash-header ${mounted ? 'visible' : ''}`}>
                        <div>
                            <div className="dash-eyebrow">Overview</div>
                            <h1 className="dash-title">School <span>Dashboard</span></h1>
                            <p className="dash-subtitle">
                                Monitor your academic resources, staff, and enrollment activity — all in one place.
                            </p>
                        </div>
                        {pageProps.schoolName && (
                            <div className="school-badge">{pageProps.schoolName}</div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="stats-grid">
                        {stats.map(({ label, icon: Icon, key, description, color, bg, border, glow }, i) => {
                            const value = pageProps[key] ?? 0;
                            const barWidth = Math.min(100, Math.max(12, (value / 500) * 100));
                            return (
                                <div
                                    key={label}
                                    className={`stat-card ${mounted ? 'visible' : ''}`}
                                    style={{
                                        '--accent': color,
                                        '--accent-bg': bg,
                                        '--accent-border': border,
                                        '--accent-glow': glow,
                                        transitionDelay: mounted ? `${i * 80}ms` : '0ms',
                                    } as React.CSSProperties}
                                >
                                    <div className="stat-glow" />

                                    <div className="stat-top">
                                        <div className="stat-icon-wrap">
                                            <Icon size={18} style={{ color }} />
                                        </div>
                                        <div className="stat-trend">
                                            <TrendingUp size={10} /> Active
                                        </div>
                                    </div>

                                    <div className="stat-value">
                                        {mounted ? <AnimatedNumber value={value} /> : 0}
                                    </div>
                                    <div className="stat-label">{label}</div>
                                    <div className="stat-desc">{description}</div>

                                    <div className="stat-bar">
                                        <div
                                            className="stat-bar-fill"
                                            style={{ width: mounted ? `${barWidth}%` : '0%' }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}