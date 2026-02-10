'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('participant');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', { name, email, password, userType });
            router.push('/login?msg=Registration successful! Please log in to complete your profile.');
        } catch (err: any) {
            setError(err.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-10 px-6">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Join HackNect</h1>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Min 8 characters"
                            minLength={8}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">I am joining as a:</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['participant', 'mentor', 'startup'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setUserType(type)}
                                    className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${userType === type ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white text-gray-500 border-gray-200 hover:border-cyan-300'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-cyan-600 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    Already have an account? <Link href="/login" className="text-cyan-500 font-bold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}
