"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/hooks/useFirestore";
import { firestoreService } from "@/hooks/useFirestore";

export default function FirebaseExample() {
    const { profile, loginWithGoogle, logout } = useAuth();
    const { teams, loading } = useTeams();

    const handleCreateTeam = async () => {
        if (!profile) return;
        try {
            await firestoreService.createTeam({
                name: "New AI Team",
                description: "Built with Firebase",
                adminId: profile.uid,
                currentMembers: [profile.uid],
                status: "forming",
                hackathonId: "hackathon_001",
            });
            alert("Team created!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-8 space-y-6 bg-slate-900 text-white rounded-xl border border-slate-700">
            <h2 className="text-2xl font-bold text-blue-400">Firebase Real-time Demo</h2>

            {!profile ? (
                <button
                    onClick={loginWithGoogle}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                    Login with Google
                </button>
            ) : (
                <div className="flex items-center gap-4">
                    <p>Welcome, <span className="font-semibold">{profile.name}</span></p>
                    <button
                        onClick={logout}
                        className="px-4 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
                    >
                        Logout
                    </button>
                </div>
            )}

            <div>
                <h3 className="text-xl font-semibold mb-3">Real-time Teams ({teams.length})</h3>
                {loading ? (
                    <p className="text-slate-400">Loading teams...</p>
                ) : (
                    <div className="grid gap-3">
                        {teams.map(team => (
                            <div key={team.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <h4 className="font-bold">{team.name}</h4>
                                <p className="text-sm text-slate-300">{team.description}</p>
                                <div className="mt-2 text-xs text-blue-300">Status: {team.status}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={handleCreateTeam}
                disabled={!profile}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl font-bold disabled:opacity-50"
            >
                Create New Team (Real-time)
            </button>
        </div>
    );
}
