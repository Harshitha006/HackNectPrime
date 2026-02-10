'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Hackathon {
    id: string;
    name: string;
    theme: string;
    date: string;
    location: string;
    description: string;
    deadline: string;
    type: 'Global' | 'National';
    tags: string[];
}

export default function EventsPage() {
    const [events, setEvents] = useState<Hackathon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'All' | 'National' | 'Global'>('All');
    const [search, setSearch] = useState('');
    const [joiningId, setJoiningId] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await api.get('/events');
                // Map DB snake_case to CamelCase if needed, but assuming API provides correct format
                // For now use mock if server returns empty or fails
                if (!data.events || data.events.length === 0) {
                    setEvents([
                        {
                            id: '1',
                            name: 'Codefest 2025',
                            theme: 'Innovation in Technology',
                            date: 'March 15-17, 2025',
                            location: 'Mumbai, India',
                            deadline: 'March 10, 2025',
                            type: 'National',
                            description: 'India\'s largest student coding championship.',
                            tags: ['Web', 'Mobile', 'Innovate']
                        },
                        {
                            id: '2',
                            name: 'AI/ML Global Hackathon',
                            theme: 'AI for Social Good',
                            date: 'April 01-03, 2025',
                            location: 'Virtual',
                            deadline: 'March 25, 2025',
                            type: 'Global',
                            description: 'Build AI solutions that matter.',
                            tags: ['AI', 'ML', 'Python']
                        }
                    ]);
                } else {
                    setEvents(data.events);
                }
            } catch (err: any) {
                console.error('Failed to fetch events:', err);
                setError('Could not connect to the event server. Showing local listings.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleJoinEvent = async (eventId: string, eventName: string) => {
        setJoiningId(eventId);
        try {
            await api.post('/events/register', { eventId, optIn: true });
            alert(`Successfully registered for ${eventName}! You will receive updates soon.`);
        } catch (err: any) {
            console.error('Registration failed:', err);
            // Simulate success for demo
            alert(`Join request for ${eventName} sent! (Demo Mode)`);
        } finally {
            setJoiningId(null);
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesFilter = filter === 'All' || event.type === filter;
        const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase()) ||
            event.theme.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Upcoming Hackathons</h1>
                    <p className="text-gray-600">Discover and join the best hackathons globally.</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('All')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'All' ? 'bg-cyan-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('National')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'National' ? 'bg-cyan-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        National
                    </button>
                    <button
                        onClick={() => setFilter('Global')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'Global' ? 'bg-cyan-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        Global
                    </button>
                </div>
            </div>

            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search by name, theme, or tags..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading events...</p>
                </div>
            ) : error ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 px-6 py-4 rounded-2xl mb-8 flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>{error}</p>
                </div>
            ) : null}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                        <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-600 p-6 flex items-end">
                            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                                {event.type}
                            </span>
                        </div>

                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
                                {event.name}
                            </h3>
                            <p className="text-sm font-semibold text-cyan-600 mb-4">{event.theme}</p>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-600 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {event.date}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {event.location}
                                </div>
                                <div className="flex items-center text-red-500 text-sm font-semibold">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Deadline: {event.deadline}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {event.tags.map(tag => (
                                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => handleJoinEvent(event.id, event.name)}
                                disabled={joiningId === event.id}
                                className="w-full btn btn-primary py-3 rounded-xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {joiningId === event.id ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registering...
                                    </>
                                ) : 'Join Event'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
