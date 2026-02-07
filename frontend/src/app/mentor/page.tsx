"use client";

import React from "react";
import {
    Radar,
    MessageSquare,
    Users,
    Zap,
    Bell,
    Search,
    LayoutDashboard,
    Calendar,
    Trophy,
    TrendingUp,
    Sparkles,
    CheckCircle2,
    XCircle,
    ArrowRight,
    GraduationCap,
    Cpu,
    Target
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMentorshipRequests, useTeams, firestoreService } from "@/hooks/useFirestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationCenter } from "@/components/NotificationCenter";

export default function MentorDashboard() {
    const router = useRouter();
    const { user, profile, loading: authLoading } = useAuth();
    const { requests, loading: requestsLoading } = useMentorshipRequests(user?.uid || "", 'mentor');
    const { teams, loading: teamsLoading } = useTeams();

    if (authLoading) return <div className="min-h-screen bg-[#08080a] text-white flex items-center justify-center font-bold uppercase tracking-widest animate-pulse">Loading Mentor Portal...</div>;

    // Safety check for mentor role
    if (profile?.role !== 'mentor') {
        return (
            <div className="min-h-screen bg-[#08080a] text-white flex flex-col items-center justify-center p-6 text-center">
                <Target size={48} className="text-rose-500 mb-6" />
                <h1 className="text-xl font-bold uppercase mb-2">Access Restricted</h1>
                <p className="text-white/40 text-[10px] max-w-md uppercase tracking-widest font-bold">Only certified mentors can access this portal.</p>
                <button onClick={() => router.push('/dashboard')} className="mt-8 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/80 transition-all">Return to Dashboard</button>
            </div>
        );
    }

    const handleRequestAction = async (requestId: string, status: 'accepted' | 'rejected') => {
        try {
            await firestoreService.updateMentorshipStatus(requestId, status);
            toast.success(status === 'accepted' ? "Connection Synchronized" : "Request Neutralized", {
                description: status === 'accepted' ? "You have officially joined the team's neural network." : "The request has been removed from your queue."
            });
        } catch (error) {
            toast.error("Process failed. Feedback loop error.");
        }
    };

    const mentorForTeams = teams.filter(t => t.activeMentors?.includes(user?.uid || ""));

    return (
        <div className="min-h-screen bg-[#08080a] text-white flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-3xl hidden lg:flex flex-col">
                <div className="p-8 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <GraduationCap size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        Mentor<span className="text-indigo-400">Hub</span>
                    </span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <SidebarItem icon={<LayoutDashboard size={18} />} label="Overview" active />
                    <SidebarItem icon={<Users size={18} />} label="My Teams" count={mentorForTeams.length} />
                    <SidebarItem icon={<MessageSquare size={18} />} label="Direct Relays" />
                    <div className="pt-10 px-4">
                        <SidebarItem
                            icon={<Zap size={18} className="text-amber-400" />}
                            label="Student Dashboard"
                            onClick={() => router.push('/dashboard')}
                        />
                    </div>
                </nav>

                <div className="p-6 border-t border-white/5">
                    <div className="flex items-center space-x-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xs">
                            {profile?.name?.[0] || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase truncate">{profile?.name}</p>
                            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Master Mentor</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#08080a]/80 backdrop-blur-xl z-40">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Guidance Center</h2>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full">
                            <Cpu size={12} />
                            <span>System active</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center relative">
                            <Search className="absolute left-3 text-white/20" size={14} />
                            <input
                                type="text"
                                placeholder="Search Teams..."
                                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest focus:border-indigo-500/50 outline-none w-64 transition-all"
                            />
                        </div>
                        <NotificationCenter />
                    </div>
                </header>

                <div className="p-8 space-y-12">
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard icon={<Users className="text-indigo-400" />} label="Teams Advised" value={mentorForTeams.length.toString()} color="indigo" />
                        <StatCard icon={<TrendingUp className="text-emerald-400" />} label="Success Rate" value="94%" color="emerald" />
                        <StatCard icon={<Zap className="text-amber-400" />} label="Blockers Solved" value="128" color="amber" />
                        <StatCard icon={<Target className="text-rose-400" />} label="Active Sessions" value="3" color="rose" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Requests Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold uppercase tracking-tight">Incoming Requests <span className="text-indigo-500 text-sm ml-2">({requests.filter(r => r.status === 'pending').length})</span></h3>
                                <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">Clear All</button>
                            </div>

                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {requestsLoading ? (
                                        [1, 2].map(i => <div key={i} className="h-32 rounded-[2.5rem] bg-white/5 animate-pulse" />)
                                    ) : requests.filter(r => r.status === 'pending').length > 0 ? (
                                        requests.filter(r => r.status === 'pending').map((request) => (
                                            <RequestCard
                                                key={request.id}
                                                request={request}
                                                onAccept={() => handleRequestAction(request.id, 'accepted')}
                                                onReject={() => handleRequestAction(request.id, 'rejected')}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-dashed border-white/5 rounded-[3rem] text-center">
                                            <Radar className="text-white/10 mb-4 animate-pulse" size={48} />
                                            <p className="text-xs font-black uppercase text-white/20 tracking-widest">No Incoming Frequency Detected</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* History Section */}
                            <div className="pt-12">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/30 mb-8 border-b border-white/5 pb-4">Decision Repository</h3>
                                <div className="space-y-3">
                                    {requests.filter(r => r.status !== 'pending').slice(0, 5).map(request => (
                                        <div key={request.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="flex items-center space-x-4">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    request.status === 'accepted' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                                                )} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Team ID: {request.teamId.substring(0, 8)}...</span>
                                            </div>
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-widest",
                                                request.status === 'accepted' ? "text-emerald-400" : "text-rose-400"
                                            )}>{request.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Active Teams Column */}
                        <div className="space-y-8">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Active Syncs</h3>
                            <div className="space-y-4">
                                {teamsLoading ? (
                                    <div className="h-40 rounded-[2.5rem] bg-white/5 animate-pulse" />
                                ) : mentorForTeams.length > 0 ? (
                                    mentorForTeams.map((team) => (
                                        <motion.div
                                            key={team.id}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => router.push(`/teams/${team.id}`)}
                                            className="p-6 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/20 group cursor-pointer hover:bg-indigo-500/10 transition-all relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                <Sparkles size={40} className="text-indigo-400" />
                                            </div>
                                            <h4 className="text-lg font-black uppercase italic tracking-tighter mb-2">{team.name}</h4>
                                            <div className="flex items-center space-x-2 text-[10px] font-bold text-indigo-400/60 uppercase tracking-widest mb-6">
                                                <Target size={12} />
                                                <span>{team.projectIdea.substring(0, 30)}...</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {team.currentMembers.slice(0, 3).map((m, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-lg bg-white/10 border border-[#050505] flex items-center justify-center text-[10px] font-black">
                                                            {m[0].toUpperCase()}
                                                        </div>
                                                    ))}
                                                    {team.currentMembers.length > 3 && (
                                                        <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black">
                                                            +{team.currentMembers.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <ArrowRight size={16} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                                        <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">No active mentorships</p>
                                    </div>
                                )}
                            </div>

                            {/* Quick Tips or Announcements */}
                            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest flex items-center space-x-2">
                                    <Sparkles size={14} className="text-indigo-400" />
                                    <span>Mentor Protocol</span>
                                </h4>
                                <ul className="space-y-2">
                                    {["Check chat velocity daily", "Prioritize blocker signals", "Review heatmaps weekly"].map((tip, i) => (
                                        <li key={i} className="flex items-center space-x-2 text-[10px] font-bold text-white/50 uppercase tracking-tighter">
                                            <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SidebarItem({ icon, label, active = false, onClick, count, isPremium }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group",
                active
                    ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20"
                    : "text-white/30 hover:text-white hover:bg-white/5"
            )}
        >
            <div className="flex items-center space-x-3">
                <span className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-indigo-400/60")}>
                    {icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                {isPremium && (
                    <div className="px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-400 text-[8px] font-black uppercase">Plus</div>
                )}
            </div>
            {count !== undefined && (
                <span className={cn(
                    "w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black",
                    active ? "bg-white/20 text-white" : "bg-indigo-500/20 text-indigo-400"
                )}>{count}</span>
            )}
        </button>
    );
}

function StatCard({ icon, label, value, color }: any) {
    const colors: any = {
        indigo: "bg-indigo-500/10 border-indigo-500/20",
        emerald: "bg-emerald-500/10 border-emerald-500/20",
        amber: "bg-amber-400/10 border-amber-400/20",
        rose: "bg-rose-500/10 border-rose-500/20"
    };

    return (
        <div className={cn("p-6 rounded-[2rem] border flex flex-col items-center justify-center text-center space-y-2", colors[color])}>
            <div className="p-2 rounded-xl bg-white/5 mb-1">
                {icon}
            </div>
            <p className="text-2xl font-black italic tracking-tighter">{value}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{label}</p>
        </div>
    );
}

function RequestCard({ request, onAccept, onReject }: any) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all group relative"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black italic shadow-lg shadow-indigo-500/10">
                            T
                        </div>
                        <div>
                            <h4 className="text-lg font-black uppercase italic tracking-tighter group-hover:text-indigo-400 transition-colors">Team Signal Detected</h4>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] leading-none mt-1">ID: {request.teamId.substring(0, 12)}</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                        <p className="text-[11px] font-medium text-white/60 leading-relaxed italic">
                            <span className="text-indigo-400 font-black not-italic mr-2">MSG:</span>
                            "{request.message}"
                        </p>
                    </div>
                </div>

                <div className="flex flex-row md:flex-col items-center gap-3">
                    <button
                        onClick={onAccept}
                        className="flex-1 md:w-32 py-3 rounded-xl bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-all flex items-center justify-center space-x-2"
                    >
                        <CheckCircle2 size={14} />
                        <span>Accept</span>
                    </button>
                    <button
                        onClick={onReject}
                        className="flex-1 md:w-32 py-3 rounded-xl bg-white/5 hover:bg-rose-500/10 text-white/40 hover:text-rose-400 font-black uppercase tracking-widest text-[10px] border border-white/10 hover:border-rose-500/30 transition-all flex items-center justify-center space-x-2"
                    >
                        <XCircle size={14} />
                        <span>Dismiss</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
