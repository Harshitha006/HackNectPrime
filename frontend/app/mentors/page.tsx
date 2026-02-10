'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function MentorsPage() {
    const [activeTab, setActiveTab] = useState<'browse' | 'my-teams'>('browse');
    const [isJoining, setIsJoining] = useState<string | null>(null);

    const teamsNeedingMentors = [
        { id: 't1', name: 'Team Innovate', project: 'Smart Waste Management', needs: 'AI/ML Expert', members: 4, matchScore: 95 },
        { id: 't2', name: 'HealthChain', project: 'Blockchain Health Records', needs: 'Security Expert', members: 3, matchScore: 88 },
        { id: 't3', name: 'EduPortal', project: 'Gamified Learning', needs: 'UX Designer', members: 5, matchScore: 72 },
    ];

    const handleJoinAsMentor = async (teamId: string) => {
        setIsJoining(teamId);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Your mentor request has been sent! The team will review your profile.');
        } catch (error) {
            alert('Failed to send request. Please try again.');
        } finally {
            setIsJoining(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Mentor Hub</h1>
                    <p className="text-gray-600">Empower the next generation of innovators with your expertise.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'browse' ? 'bg-white shadow-sm text-cyan-600' : 'text-gray-500'}`}
                    >
                        Browse Teams
                    </button>
                    <button
                        onClick={() => setActiveTab('my-teams')}
                        className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'my-teams' ? 'bg-white shadow-sm text-cyan-600' : 'text-gray-500'}`}
                    >
                        My Mentees
                    </button>
                </div>
            </div>

            {activeTab === 'browse' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamsNeedingMentors.map((team, i) => (
                        <div key={i} className="card p-6 flex flex-col hover:border-cyan-500 transition-all border-l-4 border-l-cyan-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-black uppercase">Mentor Needed</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-cyan-600">{team.matchScore}%</div>
                                    <div className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Compatibility</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl mb-6 flex-grow">
                                <p className="text-sm font-bold text-gray-700 mb-1">Project Idea:</p>
                                <p className="text-sm text-gray-600 italic line-clamp-3">"{team.project}"</p>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Looking For:</p>
                                    <p className="text-sm font-bold text-gray-900">{team.needs}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(j => <div key={j} className="w-6 h-6 rounded-full bg-gray-300 border border-white"></div>)}
                                    </div>
                                    <span className="text-xs text-gray-500">{team.members} members</span>
                                </div>
                                <button
                                    onClick={() => handleJoinAsMentor(team.id)}
                                    disabled={isJoining === team.id}
                                    className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyan-600 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                                >
                                    {isJoining === team.id ? 'Sending...' : 'Join as Mentor'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'my-teams' && (
                <div className="card p-20 text-center">
                    <div className="w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-6 text-cyan-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">You aren't mentoring any teams yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">Browse the team list to find projects that align with your expertise and offer them guidance.</p>
                    <button onClick={() => setActiveTab('browse')} className="btn btn-primary px-10 py-4 rounded-2xl font-bold shadow-xl">
                        Start Browsing Teams
                    </button>
                </div>
            )}
        </div>
    );
}
