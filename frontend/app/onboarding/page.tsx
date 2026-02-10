'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

export default function OnboardingPage() {
    const router = useRouter();
    const { user, logout, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        major: '',
        skills: '',
        bio: '',
        expertise: '',
        availability: '',
        company: '',
        industry: ''
    });
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const userType = user?.user_type || 'participant';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBackToSignup = () => {
        logout();
        router.push('/signup');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                name: formData.name || user?.name
            };

            // Mark as onboarded in backend with data
            await api.post('/auth/onboarding/complete', payload);

            setIsSuccess(true);

            // Redirect to home after a short delay
            setTimeout(() => {
                window.location.href = '/'; // Full refresh to get updated user state with new is_onboarded value
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to create profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Created!</h2>
                    <p className="text-gray-600 mb-8">Redirecting you to login to refresh your session...</p>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full animate-[progress_2.5s_linear]"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="text-center mb-10">
                <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">
                    Onboarding: {userType}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Build Your Profile</h1>
                <p className="text-gray-600">Tell us about your {userType === 'startup' ? 'company' : 'expertise'} to get started.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-shake">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            <div className="card overflow-hidden">
                <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Profile Details</p>
                    <button
                        onClick={handleBackToSignup}
                        className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Change role
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                defaultValue={user.name}
                                disabled={loading}
                                placeholder="John Doe"
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50"
                            />
                        </div>

                        {userType === 'participant' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Major / Field of Study</label>
                                <input
                                    type="text"
                                    name="major"
                                    required
                                    disabled={loading}
                                    placeholder="Computer Science"
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                        )}

                        {userType === 'startup' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Company Name</label>
                                <input
                                    type="text"
                                    name="company"
                                    required
                                    disabled={loading}
                                    placeholder="TechGenius Inc."
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">
                                {userType === 'mentor' ? 'Expertise Areas (comma separated)' : 'Core Skills (e.g. React, UX, Python)'}
                            </label>
                            <input
                                type="text"
                                name={userType === 'mentor' ? 'expertise' : 'skills'}
                                required
                                disabled={loading}
                                placeholder={userType === 'mentor' ? 'Cloud Architecture, Backend' : 'TypeScript, SQL, Docker'}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                        </div>

                        {userType === 'mentor' && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Availability</label>
                                <input
                                    type="text"
                                    name="availability"
                                    required
                                    disabled={loading}
                                    placeholder="Evenings, weekends"
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Bio (Short summary)</label>
                            <textarea
                                name="bio"
                                rows={3}
                                required
                                disabled={loading}
                                placeholder="Tell teams why you're a great match."
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-cyan-500/20 hover:bg-cyan-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Finalizing...
                                </>
                            ) : (
                                <>
                                    Complete Profile
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
