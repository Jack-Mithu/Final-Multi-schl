import React from 'react';
import { GraduationCap, Users, Calendar, BarChart3, Shield, Globe } from 'lucide-react';

interface WelcomeProps {
    canRegister?: boolean;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

export default function Welcome({ canRegister = true, auth }: WelcomeProps) {
    const features = [
        {
            icon: Users,
            title: "Multi-School Management",
            description: "Manage multiple schools from one central dashboard"
        },
        {
            icon: GraduationCap,
            title: "Student & Staff Portal",
            description: "Role-based access for students, teachers, and admins"
        },

        {
            icon: BarChart3,
            title: "Performance Analytics",
            description: "Real-time insights and reports"
        },

    ];

    return (
        <div className="min-h-screen ">
            
            {/* Background Layer */}
            <div className="fixed inset-0 bg-hero z-0"></div>
            <div className="relative z-10">

            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Multi-SchoolHub
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {auth?.user ? (
                                <a
                                    href="/dashboard"
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                                >
                                    Dashboard
                                </a>
                            ) : (
                                <>
                                    <a
                                        href="/login"
                                        className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                    >
                                        Log in
                                    </a>
                                    {canRegister && (
                                        <a
                                            href="/register"
                                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                                        >
                                            Register
                                        </a>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto space-y-8">
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight [text-shadow:0_0_25px_rgba(255,255,255,0.8)]">
                            Multitenancy Schools
                            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent
                                [text-shadow:0_0_22px_rgba(99,102,241,0.75)]">
                                Made Simple
                            </span>
                        </h1>
                        
                        <p className="block bg-gradient-to-r text-xl  leading-relaxed max-w-2xl mx-auto [text-shadow:0_0_25px_rgba(255,255,255,0.8)]">
                            Comprehensive cloud-based platform for managing multiple schools. 
                            Streamline operations and focus on education.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {!auth?.user && canRegister && (
                                <a
                                    href="/register"
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                                >
                                    Get Started
                                </a>
                            )}
                            <a
                                href="/login"
                                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all"
                            >
                                Login
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-gray-600">
                            Comprehensive tools for modern educational institutions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-2xl border border-gray-200 hover:shadow-[0_0_25px_6px_rgba(255,255,255,0.7)] transition-all bg-white"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-gray-200">
                <div className="max-w-7xl mx-auto text-center text-gray-600">
                    <p className="text-sm">
                        © 2024 SchoolHub. All rights reserved.
                    </p>
                </div>
            </footer>
            </div>
           
        </div>
    );
}