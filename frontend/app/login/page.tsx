'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const msg = searchParams.get('msg');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await api.post('/auth/login', { email, password });
            login(data.token, data.user);
            if (data.user.is_onboarded) {
                router.push('/');
            } else {
                router.push('/onboarding');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        alert('Google Login is not yet configured with a Client ID. Use email/password.');
    };

    return (
        <div className="max-w-md mx-auto py-20 px-6">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h1>

                {msg && <p className="bg-green-50 text-green-700 p-3 rounded-xl text-sm mb-6 text-center font-medium border border-green-100">{msg}</p>}

                <button
                    onClick={handleGoogleLogin}
                    className="w-full mb-6 flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                    Sign in with Google
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500 uppercase font-bold tracking-widest text-[10px]">Or with Email</span>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
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
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-cyan-600 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    Don't have an account? <Link href="/signup" className="text-cyan-500 font-bold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
