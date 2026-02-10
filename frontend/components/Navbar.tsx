'use client';

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <header className="bg-white border-b py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/">
                    <h1 className="text-2xl font-bold text-cyan-500 cursor-pointer">HackNect</h1>
                </Link>
                <nav>
                    <ul className="flex space-x-6">
                        <li><Link href="/" className="hover:text-cyan-600">Home</Link></li>
                        {user?.user_type === 'participant' && (
                            <li><Link href="/teams" className="hover:text-cyan-600">My Teams</Link></li>
                        )}
                        {user?.user_type === 'mentor' && (
                            <li><Link href="/teams" className="hover:text-cyan-600">Match Requests</Link></li>
                        )}
                        {user?.user_type === 'startup' && (
                            <li><Link href="/prime" className="text-indigo-600 font-bold hover:text-indigo-800">Startup Portal</Link></li>
                        )}
                        <li><Link href="/mentors" className="hover:text-cyan-600">Mentors</Link></li>
                        <li><Link href="/events" className="hover:text-cyan-600">Hackathons</Link></li>
                    </ul>
                </nav>
                <div className="flex space-x-4 items-center">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col text-right">
                                <span className="text-sm font-bold text-gray-900">{user.name}</span>
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{user.user_type}</span>
                            </div>
                            <button
                                onClick={() => {
                                    logout();
                                    router.push('/');
                                }}
                                className="btn btn-outline py-2 px-4 text-xs font-bold"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="btn btn-outline">Log In</Link>
                            <Link href="/signup" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
