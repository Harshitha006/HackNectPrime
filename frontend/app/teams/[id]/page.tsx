'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function TeamDashboard() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'analytics'>('overview');

    // Mock data for skill gap analysis
    const skillGaps = [
        { skill: 'Python', status: 'Strong', color: 'bg-green-500' },
        { skill: 'Data Science', status: 'Strong', color: 'bg-green-500' },
        { skill: 'Machine Learning', status: 'Missing', color: 'bg-red-500' },
        { skill: 'Frontend (React)', status: 'Missing', color: 'bg-red-500' },
        { skill: 'Deployment', status: 'Intermediate', color: 'bg-amber-500' },
    ];

    // Mock radar alert
    const radarAlert = {
        struggleScore: 0.75,
        status: 'Needs Mentor',
        reason: "Detected repeated 'not working' and 'stuck' in chat.",
        suggestion: "We found 2 AI mentors available now who specialize in ML deployment."
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Team Innovate Dashboard</h1>
                    <p className="text-gray-600">Building a Smart Waste Management System</p>
                </div>
                <div className="flex gap-2">
                    <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-bold">Hackathon: Codefest 2025</span>
                </div>
            </div>

            <div className="flex gap-4 mb-8 border-b">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-4 px-2 font-semibold transition-all ${activeTab === 'overview' ? 'text-cyan-600 border-b-2 border-cyan-500' : 'text-gray-500'}`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`pb-4 px-2 font-semibold transition-all ${activeTab === 'chat' ? 'text-cyan-600 border-b-2 border-cyan-500' : 'text-gray-500'}`}
                >
                    Team Chat
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`pb-4 px-2 font-semibold transition-all ${activeTab === 'analytics' ? 'text-cyan-600 border-b-2 border-cyan-500' : 'text-gray-500'}`}
                >
                    AI Analytics
                </button>
            </div>

            {activeTab === 'overview' && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="card">
                        <h3 className="text-xl font-bold mb-4">Project Idea</h3>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            A smart bin system that uses computer vision to automatically sort waste into recyclable and non-recyclable categories.
                            The system will provide real-time data to municipal authorities for optimized garbage collection routes.
                        </p>
                        <h4 className="font-bold mb-2">Current Members</h4>
                        <div className="flex -space-x-3 mb-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                                    U{i}
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full bg-cyan-100 border-2 border-white flex items-center justify-center text-xs font-bold text-cyan-600">
                                +2
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
                            <div className="flex items-center gap-3 mb-3 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="text-lg font-bold">Skills Gaps Detected</h3>
                            </div>
                            <p className="text-sm text-red-700 mb-4">Your team is missing key experts for this project idea.</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Machine Learning Engineer</span>
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">React Developer</span>
                            </div>
                        </div>

                        <div className="bg-cyan-50 border border-cyan-100 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-cyan-900 mb-2">Mentor Status</h3>
                            <p className="text-sm text-cyan-700 mb-4">No mentor assigned yet.</p>
                            <button className="w-full bg-white text-cyan-600 border border-cyan-200 py-2 rounded-xl font-bold hover:bg-cyan-100 transition-all">
                                Find AI Recommended Mentor
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'analytics' && (
                <div className="space-y-8">
                    <div className="card">
                        <h3 className="text-2xl font-bold mb-6">Skills Gap Heatmap</h3>
                        <div className="space-y-4">
                            {skillGaps.map(item => (
                                <div key={item.skill} className="flex items-center gap-4">
                                    <div className="w-40 text-sm font-semibold text-gray-700">{item.skill}</div>
                                    <div className="flex-grow bg-gray-100 h-4 rounded-full overflow-hidden">
                                        <div className={`${item.color} h-full transition-all`} style={{ width: item.status === 'Strong' ? '100%' : item.status === 'Intermediate' ? '60%' : '10%' }}></div>
                                    </div>
                                    <div className={`w-24 text-xs font-bold text-right ${item.status === 'Missing' ? 'text-red-500' : 'text-green-600'}`}>{item.status}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card border-amber-200 bg-amber-50 shadow-amber-100">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                    </span>
                                    Mentor Radar
                                </h3>
                                <p className="text-amber-800">Automatic struggle detection active.</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-amber-600">{radarAlert.struggleScore * 100}%</div>
                                <div className="text-xs font-bold text-amber-700 uppercase tracking-widest">Struggle Score</div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-amber-100 mb-6">
                            <p className="font-semibold text-gray-900 mb-2">AI Observation:</p>
                            <p className="text-gray-700 italic">"{radarAlert.reason}"</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <p className="text-amber-900 font-medium">{radarAlert.suggestion}</p>
                            <button className="whitespace-nowrap bg-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600 shadow-lg shadow-amber-500/30 transition-all">
                                Request Mentor Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'chat' && (
                <div className="card h-[500px] flex flex-col p-0 overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 font-bold"># general-chat</div>
                    <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500 flex-shrink-0"></div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm">TeamLead</span>
                                    <span className="text-[10px] text-gray-400">10:45 AM</span>
                                </div>
                                <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-2xl rounded-tl-none">Hey team, I'm having trouble with the ML model. The loss is not improving at all.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-400 flex-shrink-0"></div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm">DevJosh</span>
                                    <span className="text-[10px] text-gray-400">10:47 AM</span>
                                </div>
                                <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded-2xl rounded-tl-none">I'm also stuck on the frontend connection. It's just not working.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold uppercase tracking-widest">Mentor Radar: Struggle Detected (Score: 0.75)</span>
                        </div>
                    </div>
                    <div className="p-4 border-t bg-white">
                        <div className="flex gap-2">
                            <input type="text" placeholder="Type a message..." className="flex-grow p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500" />
                            <button className="bg-cyan-500 text-white p-3 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
