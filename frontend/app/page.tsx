'use client';

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="relative overflow-hidden">
            {/* Hero Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-cyan-50/50 to-transparent -z-10" />
            <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10 animate-pulse delay-700" />

            <main className="max-w-6xl mx-auto px-6 pt-24 pb-32">
                <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-cyan-50 border border-cyan-100">
                        <span className="text-cyan-600 text-sm font-bold tracking-wide uppercase">AI-Powered Collaboration</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tight">
                        Launch Your Next <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">Big Idea</span> Together.
                    </h1>

                    <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                        The ultimate hub where visionary developers, elite mentors, and innovative startups unite. Get matched by AI, build with precision, and win.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href={user ? (user.is_onboarded ? "/teams" : "/onboarding") : "/signup"}
                            className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-2xl hover:bg-gray-800 hover:-translate-y-1 transition-all active:scale-95"
                        >
                            {user ? (user.is_onboarded ? "Go to Platform" : "Complete Profile") : "Get Started Now"}
                        </Link>
                        <Link
                            href="/teams"
                            className="w-full sm:w-auto px-10 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-cyan-200 hover:text-cyan-600 transition-all active:scale-95"
                        >
                            Explore Teams
                        </Link>
                    </div>
                </div>

                {/* Trust Section / Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-gray-100 mb-20">
                    {[
                        { label: 'Users Matched', value: '5K+' },
                        { label: 'Active Teams', value: '1,200' },
                        { label: 'Mentor Experts', value: '450' },
                        { label: 'Startups Hiring', value: '80+' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="group p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500">
                        <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 mb-8 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Neural Matching</h3>
                        <p className="text-gray-500 leading-relaxed">Our proprietary AI analyzes skills, personality, and experience to find your perfect technical co-founder.</p>
                    </div>

                    <div className="group p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Skill Validation</h3>
                        <p className="text-gray-500 leading-relaxed">Prove your expertise with verified badges and project reviews from our network of elite mentors.</p>
                    </div>

                    <div className="group p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Founder Path</h3>
                        <p className="text-gray-500 leading-relaxed">Top-tier teams get exclusive access to startup programs, early-stage funding, and talent scouts.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
