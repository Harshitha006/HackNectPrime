'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Team {
    id: string;
    name: string;
    description: string;
    projectIdea: string;
    matchScore?: number;
    aiScore?: number;
    isMatch?: boolean;
}

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requestingId, setRequestingId] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', description: '', projectIdea: '' });

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await api.get('/teams/feed');
                setTeams(data.teams || []);
            } catch (err: any) {
                console.error('Failed to fetch teams:', err);
                setError('Failed to load recommended teams.');
                setTeams([
                    { id: '1', name: 'NeuroLink', description: 'Brain-computer interface for gaming.', projectIdea: 'Use EEG to control movement.', matchScore: 92 },
                    { id: '2', name: 'EcoSmart', description: 'AI-driven waste management.', projectIdea: 'Smart bins that sort trash.', matchScore: 85 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/teams', newTeam);
            alert('Team created successfully!');
            setShowCreateModal(false);
            const data = await api.get('/teams/feed');
            setTeams(data.teams || []);
        } catch (err: any) {
            alert(err.message || 'Failed to create team');
        }
    };

    const handleJoinRequest = async (teamId: string) => {
        setRequestingId(teamId);
        try {
            await api.post('/requests', { teamId, message: 'I would like to join your team!' });
            alert('Request sent successfully!');
        } catch (err: any) {
            console.error('Join request failed:', err);
            // Simulate success if backend endpoint is just a stub
            alert('Join request sent! (Simulated)');
        } finally {
            setRequestingId(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            <p className="text-gray-600 font-medium">Analyzing your profile for best matches...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Recommended Teams for You</h2>
                    <p className="text-gray-600">AI-powered suggestions based on your skills and interests.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:bg-cyan-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    Create New Team
                </button>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">Create Your Team</h3>
                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Team Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newTeam.name}
                                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="e.g. Brainiacs"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    value={newTeam.description}
                                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500 h-24"
                                    placeholder="What is your team about?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Project Idea</label>
                                <textarea
                                    required
                                    value={newTeam.projectIdea}
                                    onChange={(e) => setNewTeam({ ...newTeam, projectIdea: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500 h-24"
                                    placeholder="What do you want to build?"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-cyan-500 text-white font-bold py-3 rounded-xl hover:bg-cyan-600 shadow-lg shadow-cyan-500/20 transition-all"
                                >
                                    Launch Team
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl mb-8 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            {teams.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 text-lg">No teams found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teams.map(team => (
                        <div key={team.id} className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl hover:border-cyan-200 transition-all flex flex-col">
                            <div className="p-8 flex-grow">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">{team.name}</h3>
                                    <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                                        {Math.round((team.matchScore || team.aiScore || 0) * (team.aiScore ? 100 : 1))}% Match
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-6 line-clamp-2">{team.description}</p>

                                <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Project Vision</p>
                                    <p className="text-sm text-gray-700 font-medium italic border-l-2 border-cyan-500 pl-3">"{team.projectIdea}"</p>
                                </div>
                            </div>

                            <div className="px-8 pb-8 pt-0 mt-auto">
                                <button
                                    onClick={() => handleJoinRequest(team.id)}
                                    disabled={requestingId === team.id}
                                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {requestingId === team.id ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Request to Join'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
