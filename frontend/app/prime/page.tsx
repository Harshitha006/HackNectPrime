'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

export default function PrimeCenter() {
    const [activeTab, setActiveTab] = useState<'talent' | 'teams' | 'postings' | 'startups'>('talent');
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const { user } = useAuth();

    const talents = [
        { id: 'u1', name: 'Alice Chen', skills: ['Python', 'PyTorch', 'FastAPI'], match: '98%', status: 'Available' },
        { id: 'u2', name: 'Bob Smith', skills: ['React', 'TypeScript', 'AWS'], match: '92%', status: 'In a Team' },
    ];

    const teams = [
        { id: 't1', name: 'NeuroLink', project: 'BCI for Gaming', members: 3, tech: ['Python', 'C++'], match: '95%' },
        { id: 't2', name: 'EcoSmart', project: 'AI Waste Sorter', members: 4, tech: ['React', 'TensorFlow'], match: '89%' },
    ];

    const startups = [
        { id: 's1', name: 'TechGiant Inc.', industry: 'Cloud Computing', hiring: 'Frontend Engineers', culture: 'Fast-paced, Remote', match: '94%' },
        { id: 's2', name: 'GreenFuture', industry: 'CleanTech', hiring: 'Data Scientists', culture: 'Mission-driven, Collaborative', match: '88%' },
        { id: 's3', name: 'AlphaRobotics', industry: 'AI & Robotics', hiring: 'C++ Developers', culture: 'Innovation-first', match: '82%' },
    ];

    const handlePrimeAction = async (action: string, id: string) => {
        setIsProcessing(id);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert(`Prime Request: ${action} for ${id} submitted! Our concierge will facilitate the intro.`);
        } finally {
            setIsProcessing(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-3xl p-10 text-white mb-10 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-cyan-500 text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Prime Access</span>
                        <h1 className="text-4xl font-bold">HackNect Elite Portal</h1>
                    </div>
                    <p className="text-gray-300 max-w-2xl text-lg">
                        {user?.user_type === 'startup'
                            ? "Premium features for startups to headhunt elite participants and pre-formed teams."
                            : "Exclusive access for Prime participants to join top-tier startups and corporate partners."}
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
                {user?.user_type === 'startup' ? (
                    <>
                        <button
                            onClick={() => setActiveTab('talent')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'talent' ? 'bg-white shadow-md text-cyan-600 border-2 border-cyan-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            Discover Individual Talent
                        </button>
                        <button
                            onClick={() => setActiveTab('teams')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'teams' ? 'bg-white shadow-md text-cyan-600 border-2 border-cyan-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            High-Performance Teams
                        </button>
                        <button
                            onClick={() => setActiveTab('postings')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'postings' ? 'bg-white shadow-md text-cyan-600 border-2 border-cyan-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            My Job Postings
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setActiveTab('startups')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'startups' ? 'bg-white shadow-md text-cyan-600 border-2 border-cyan-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        Startup Directory
                    </button>
                )}
            </div>

            {activeTab === 'startups' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {startups.map((s) => (
                        <div key={s.id} className="card p-8 flex flex-col border-t-8 border-t-indigo-500">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">{s.name}</h3>
                                    <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest text-[10px] mt-1">{s.industry}</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-black">{s.match} Match</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 flex-grow">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Actively Hiring</p>
                                    <p className="text-sm font-semibold text-gray-700">{s.hiring}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Company Culture</p>
                                    <p className="text-sm text-gray-600 italic">"{s.culture}"</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handlePrimeAction('Join Startup Request', s.id)}
                                disabled={isProcessing === s.id}
                                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                            >
                                {isProcessing === s.id ? 'Sending...' : 'Request to Join'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'talent' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {talents.map((talent, i) => (
                        <div key={i} className="card flex items-center justify-between p-8 hover:border-cyan-200 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                                    {talent.name[0]}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{talent.name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {talent.skills.map(s => <span key={s} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">{s}</span>)}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-cyan-600 mb-1">{talent.match}</div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">AI Rec Match</div>
                                <button
                                    onClick={() => handlePrimeAction('Hiring', talent.id)}
                                    disabled={isProcessing === talent.id}
                                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
                                >
                                    {isProcessing === talent.id ? 'Processing...' : 'Hire for Internship'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'teams' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teams.map((team, i) => (
                        <div key={i} className="card p-8 hover:border-cyan-200 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{team.name}</h3>
                                    <p className="text-sm font-semibold text-cyan-600">{team.project}</p>
                                </div>
                                <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-bold">{team.match} Match</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="text-sm text-gray-500">
                                    <p>Members: {team.members}</p>
                                    <p>Tech: {team.tech.join(', ')}</p>
                                </div>
                                <button
                                    onClick={() => handlePrimeAction('Recruiting Team', team.id)}
                                    disabled={isProcessing === team.id}
                                    className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isProcessing === team.id ? 'Processing...' : 'Recruit Whole Team'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'postings' && (
                <div className="card p-10 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No active postings</h3>
                    <p className="text-gray-500 mb-6">Start by announcing an internship or job opportunity to attract teams and individuals.</p>
                    <button
                        onClick={() => handlePrimeAction('Job Posting', 'new')}
                        disabled={isProcessing === 'new'}
                        className="btn btn-primary px-8 py-3 rounded-2xl font-bold shadow-xl disabled:opacity-50"
                    >
                        {isProcessing === 'new' ? 'Opening Form...' : 'Create New Announcement'}
                    </button>
                </div>
            )}
        </div>
    );
}
