"use client";

import React, { useState } from "react";
import {
    Search,
    Sparkles,
    MapPin,
    Zap,
    Trophy,
    ArrowRight,
    ChevronRight,
    Users,
    Building2,
    Briefcase,
    Github,
    Award,
    Filter
} from "lucide-react";
import { MOCK_TEAMS, MOCK_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Team } from "@/types/firebase";

const MOCK_CANDIDATES = [
    { ...MOCK_USER, id: "u1", school: "Stanford University", gradYear: "2026", hackathons: 12, activity: "Very High" },
    { id: "u2", name: "Sarah Chen", major: "AI Ethics", skills: ["Python", "TensorFlow", "NLP"], avatar: "S", school: "MIT", gradYear: "2025", hackathons: 8, activity: "High" },
    { id: "u3", name: "David Kim", major: "Cybersecurity", skills: ["Go", "Kubernetes", "Linux"], avatar: "D", school: "UC Berkeley", gradYear: "2026", hackathons: 15, activity: "Exceptional" },
];

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTeams } from "@/hooks/useFirestore";

export default function StartupPortal() {
    const router = useRouter();
    const { teams, loading: teamsLoading } = useTeams();
    const [filter, setFilter] = useState('Candidates');
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCandidates = MOCK_CANDIDATES.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredTeams = (teams || []).filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.skillsNeeded || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handlePostInternship = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: 'Posting job...',
                success: 'Job posted successfully!',
                error: 'Failed to post job.',
            }
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col">
            {/* Premium Sub-Nav */}
            <div className="bg-amber-400 text-black px-6 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Sparkles size={14} className="fill-black" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Prime Access Tier</span>
                </div>
                <p className="text-[9px] font-bold">Logged in as <span className="underline">FutureVentures Capital</span></p>
            </div>

            <nav className="glass border-b border-white/5 sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all mr-2"
                        >
                            <ChevronRight size={20} className="rotate-180" />
                        </button>
                        <Building2 size={20} className="text-amber-400" />
                        <h1 className="text-xl font-black tracking-tighter uppercase italic">Startup <span className="text-amber-400">Portal</span></h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={() => {
                                setFilter('Candidates');
                                toast.info("Showing participants");
                            }}
                            className={cn("text-[10px] font-black uppercase tracking-widest transition-all", filter === 'Candidates' ? "text-amber-400" : "text-white/40 hover:text-white")}
                        >
                            Participants
                        </button>
                        <button
                            onClick={() => {
                                setFilter('Teams');
                                toast.info("Showing teams");
                            }}
                            className={cn("text-[10px] font-black uppercase tracking-widest transition-all", filter === 'Teams' ? "text-amber-400" : "text-white/40 hover:text-white")}
                        >
                            Top Teams
                        </button>
                        <button
                            onClick={() => toast("Favorites updated")}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-[10px] font-black tracking-widest uppercase transition-all"
                        >
                            My Favorites
                        </button>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12 space-y-12 max-w-7xl">
                {/* Recruiter Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tighter mb-2 italic uppercase">Find the <span className="text-amber-400">Next Big Talent</span>.</h2>
                        <p className="text-white/40 font-medium max-w-xl leading-relaxed text-sm">AI-matched candidates based on your tech stack: <span className="text-white/80 underline decoration-amber-400/50 underline-offset-4 font-bold">REACT, NODE.JS, ML</span></p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="relative group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-amber-400 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filter University, Skills..."
                                className="bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-[10px] font-black tracking-widest uppercase focus:border-amber-400/50 focus:bg-white/[0.08] outline-none w-full md:w-80 transition-all placeholder:text-white/10"
                            />
                        </div>
                        <button
                            onClick={() => toast.info("Filters Locked", { description: "Verify your account to unlock advanced filtering." })}
                            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:border-amber-400/30 hover:text-amber-400 transition-all"
                        >
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {filter === 'Candidates' ? (
                            filteredCandidates.length > 0 ? filteredCandidates.map((u, idx) => (
                                <CandidateCard key={u.id} user={u} index={idx} />
                            )) : (
                                <div className="py-20 text-center space-y-4">
                                    <Users size={48} className="text-white/5 mx-auto" />
                                    <p className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">No participants found</p>
                                </div>
                            )
                        ) : (
                            teamsLoading ? (
                                <div className="py-20 text-center space-y-4">
                                    <p className="text-xs font-black text-amber-400 uppercase tracking-[0.3em] animate-pulse">Scanning Potential Acquisitions...</p>
                                </div>
                            ) : filteredTeams.length > 0 ? filteredTeams.map((t, idx) => (
                                <StartupTeamCard key={t.id} team={t} index={idx} />
                            )) : (
                                <div className="py-20 text-center space-y-4">
                                    <Zap size={48} className="text-white/5 mx-auto" />
                                    <p className="text-xs font-black text-white/20 uppercase tracking-[0.3em]">No High-Potential Teams Found</p>
                                </div>
                            )
                        )}
                    </div>

                    {/* Sidebar: Announcements & Stats */}
                    <div className="space-y-8">
                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-2xl shadow-amber-400/20">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center justify-between italic">
                                Dashboard
                                <Zap size={18} className="fill-black" />
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-black/10 pb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Profiles Viewed</span>
                                    <span className="text-xl font-black tracking-tighter">1,204</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-black/10 pb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Successful Hires</span>
                                    <span className="text-xl font-black tracking-tighter">42</span>
                                </div>
                            </div>
                            <button
                                onClick={handlePostInternship}
                                className="w-full mt-8 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black/90 transition-all flex items-center justify-center group shadow-xl shadow-black/20"
                            >
                                Post Internship
                                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="p-8 rounded-[2.5rem] glass-card border border-white/5 space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 italic">Insights</h3>
                            <div className="space-y-4">
                                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-2 hover:border-amber-400/20 transition-all cursor-default group">
                                    <p className="text-[9px] font-black tracking-widest opacity-30 uppercase group-hover:opacity-50 transition-opacity">Popular Skill</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-black uppercase tracking-tight">AI Engineering</span>
                                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">+14%</span>
                                    </div>
                                </div>
                                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-2 hover:border-amber-400/20 transition-all cursor-default group">
                                    <p className="text-[9px] font-black tracking-widest opacity-30 uppercase group-hover:opacity-50 transition-opacity">Demand Gap</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-black uppercase tracking-tight">Rust Architecture</span>
                                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">-8%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function CandidateCard({ user, index }: { user: any, index: number }) {
    const [connecting, setConnecting] = useState(false);

    const handleConnect = () => {
        setConnecting(true);
        setTimeout(() => {
            setConnecting(false);
            toast.success(`Request Sent`, {
                description: `We've notified ${user.name.split(' ')[0]}.`
            });
        }, 1200);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-[2.5rem] glass-card border border-white/5 group flex flex-col md:flex-row items-start md:items-center gap-8 relative overflow-hidden hover:border-amber-400/20 transition-all"
        >
            <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none group-hover:text-amber-400/5 transition-colors">
                <Briefcase size={80} />
            </div>

            <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-4xl font-black text-amber-400 shadow-xl shadow-amber-400/5 rotate-3 group-hover:rotate-0 transition-transform">
                    {user.avatar}
                </div>
                <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-black border border-white/10 text-amber-400 shadow-lg">
                    <Zap size={14} className="fill-amber-400" />
                </div>
            </div>

            <div className="flex-1 space-y-4 text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight italic uppercase">{user.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{user.major} @ {user.school} <span className="text-amber-400/50 mx-1">•</span> Class of {user.gradYear}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleConnect}
                            disabled={connecting}
                            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-white text-black transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                        >
                            {connecting ? "Sending..." : "Message"}
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill: string) => (
                        <span key={skill} className="px-3 py-1 rounded-lg bg-amber-400/5 border border-amber-400/10 text-[9px] font-black text-amber-400/80 uppercase tracking-widest">{skill}</span>
                    ))}
                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-white/20 uppercase tracking-widest italic">{user.hackathons} Events</span>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                        <Award size={14} className="text-amber-400" />
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Top Rated</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Github size={14} className="text-white/20" />
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Active Contributor</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function StartupTeamCard({ team, index }: { team: Team, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 rounded-[2.5rem] glass-card border border-white/5 group flex items-center gap-8 hover:border-amber-400/20 transition-all cursor-default"
        >
            <div className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center text-3xl font-black text-white rotate-3 group-hover:rotate-0 transition-transform">
                {team.name[0]}
            </div>
            <div className="flex-1 min-w-0 space-y-2 text-left">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">{team.name}</h3>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">78% Potential</span>
                </div>
                <p className="text-xs text-white/40 truncate font-medium">{team.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                    <div className="flex items-center space-x-1.5 text-[9px] font-black uppercase tracking-widest text-white/30">
                        <Users size={12} />
                        <span>{(team.currentMembers || []).length} Members</span>
                    </div>
                    <button
                        onClick={() => toast.success("Opening pitch deck...")}
                        className="text-[9px] font-black text-amber-400 uppercase tracking-[0.2em] hover:text-white transition-colors"
                    >
                        View Pitch Deck
                    </button>
                </div>
            </div>
            <ChevronRight size={20} className="text-white/20 group-hover:text-amber-400 transition-all" />
        </motion.div>
    );
}

