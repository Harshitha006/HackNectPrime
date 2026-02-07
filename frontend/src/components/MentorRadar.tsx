"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Radar, MessageSquare, AlertTriangle, UserPlus, Info, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { firestoreService } from "@/hooks/useFirestore";
import { UserProfile } from "@/types/firebase";

interface MentorRadarProps {
    teamId: string;
    forcedAlert?: boolean;
}

export function MentorRadar({ teamId, forcedAlert = false }: MentorRadarProps) {
    const [status, setStatus] = useState<'nominal' | 'alert' | 'thriving'>('nominal');
    const [matches, setMatches] = useState<{ mentor: UserProfile, score: number, reasons: string[] }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            if (!teamId) return;
            const mentorMatches = await firestoreService.findMentorMatches(teamId);
            setMatches(mentorMatches);
            setLoading(false);
        };
        fetchMatches();
    }, [teamId]);

    useEffect(() => {
        if (forcedAlert) {
            setStatus('alert');
        }
    }, [forcedAlert]);

    const handleRequestMentorship = async (mentorId: string) => {
        try {
            // In a real app, you'd find the team admin ID from context or team state
            // For now, alerting the user
            toast.promise(
                firestoreService.sendMentorshipRequest({
                    mentorId,
                    teamId,
                    message: "Team requires architectural guidance.",
                    status: 'pending'
                }),
                {
                    loading: 'Pinging Mentor...',
                    success: 'Signal Received!',
                    error: 'Friction in the link.'
                }
            );
        } catch (error) {
            toast.error("Transmission failed.");
        }
    };

    return (
        <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
            {/* Background Radar Effect */}
            <div className="absolute top-0 right-0 p-8 text-indigo-500/10 pointer-events-none group-hover:text-indigo-500/20 transition-colors">
                <Radar size={120} strokeWidth={1} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                            <Radar size={18} className="animate-spin-slow" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white tracking-tight">Mentor Radar™</h3>
                            <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest leading-none mt-1">Activity Analysis</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>SCANNING</span>
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-white/60">Chat Velocity</span>
                            <span className="text-indigo-400">High</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                className="h-full bg-indigo-500 shadow-sm shadow-indigo-500/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="py-8 text-center text-[10px] font-black uppercase text-white/20 tracking-[0.2em] animate-pulse">Synchronizing Mentors...</div>
                        ) : matches.length > 0 ? (
                            <div className="space-y-3">
                                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400/60">Top AI Matches</p>
                                {matches.slice(0, 2).map(({ mentor, score }) => (
                                    <div key={mentor.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group/mentor flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400 group-hover/mentor:bg-indigo-500 group-hover/mentor:text-white transition-colors">
                                                {mentor.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-white">{mentor.name}</p>
                                                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-tight">{Math.round(score * 100)}% Match</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRequestMentorship(mentor.uid)}
                                            className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"
                                        >
                                            <UserPlus size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {status !== 'alert' ? (
                            <div onClick={() => setStatus('thriving')} className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between group/suggest cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <Zap size={16} className="text-emerald-400 animate-bounce" />
                                    <div>
                                        <p className="text-xs font-bold text-emerald-200">Neural Sync Optimized</p>
                                        <p className="text-[9px] text-emerald-400/60 font-bold uppercase tracking-wider">Collective IQ is nominal</p>
                                    </div>
                                </div>
                                <Info size={14} className="text-emerald-400 group-hover/suggest:scale-110 transition-transform" />
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3"
                            >
                                <div className="flex items-center space-x-2 text-rose-400">
                                    <AlertTriangle size={16} />
                                    <p className="text-xs font-bold">Struggle Detected</p>
                                </div>
                                <p className="text-[10px] text-rose-200/60 leading-relaxed font-medium capitalize">Repeated technical blocks in chat. Requesting specialized AI mentor for the team.</p>
                                <button
                                    onClick={() => matches[0] && handleRequestMentorship(matches[0].mentor.uid)}
                                    className="w-full py-2 rounded-xl bg-primary hover:bg-primary/90 text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
                                >
                                    <UserPlus size={12} />
                                    <span>Signal Top Match</span>
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
