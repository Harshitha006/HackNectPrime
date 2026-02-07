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
        <div className="min-h-screen bg-[#08080a] text-white flex flex-col">
            {/* Premium Sub-Nav */}
            <div className="bg-amber-400 text-black px-6 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Sparkles size={14} className="fill-black" />
                    <span className="text-xs font-bold uppercase tracking-wide">Recruiter Portal</span>
                </div>
                <p className="text-xs font-medium">Logged in as <span className="font-bold">FutureVentures Capital</span></p>
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
                        <h1 className="text-lg font-bold tracking-tight uppercase">Startup <span className="text-amber-400">Portal</span></h1>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={() => {
                                setFilter('Candidates');
                                toast.info("Showing participants");
                            }}
                            className={cn("text-xs font-bold uppercase tracking-wide transition-all", filter === 'Candidates' ? "text-amber-400" : "text-white/40 hover:text-white")}
                        >
                            Participants
                        </button>
                        <button
                            onClick={() => {
                                setFilter('Teams');
                                toast.info("Showing teams");
                            }}
                            className={cn("text-xs font-bold uppercase tracking-wide transition-all", filter === 'Teams' ? "text-amber-400" : "text-white/40 hover:text-white")}
                        >
                            Top Teams
                        </button>
                        <button
                            onClick={() => toast("Favorites updated")}
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold tracking-wide uppercase transition-all"
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
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Find the <span className="text-amber-400">Next Big Talent</span>.</h2>
                        <p className="text-white/40 font-medium max-w-xl leading-relaxed text-sm">AI-matched candidates based on your tech stack: <span className="text-white/80 font-bold">REACT, NODE.JS, ML</span></p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="relative group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-amber-400 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filter University, Skills..."
                                className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-sm font-medium focus:border-amber-400/50 focus:bg-white/[0.08] outline-none w-full md:w-80 transition-all placeholder:text-white/20"
                            />
                        </div>
                        <button
                            onClick={() => toast.info("Filters Locked", { description: "Verify your account to unlock advanced filtering." })}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:border-amber-400/30 hover:text-amber-400 transition-all"
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
                                    <p className="text-xs font-bold text-amber-400 uppercase tracking-widest animate-pulse">Loading Teams...</p>
                                </div>
                            ) : filteredTeams.length > 0 ? filteredTeams.map((t, idx) => (
                                <StartupTeamCard key={t.id} team={t} index={idx} />
                            )) : (
                                <div className="py-20 text-center space-y-4">
                                    <Zap size={48} className="text-white/5 mx-auto" />
                                    <p className="text-xs font-bold text-white/20 uppercase tracking-widest">No Teams Found</p>
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
                                    <span className="text-xs font-bold uppercase tracking-wide opacity-60">Profiles Viewed</span>
                                    <span className="text-xl font-bold tracking-tight">1,204</span>
                                </div>
                                <div className="flex items-center justify-between border-b border-black/10 pb-2">
                                    <span className="text-xs font-bold uppercase tracking-wide opacity-60">Successful Hires</span>
                                    <span className="text-xl font-bold tracking-tight">42</span>
                                </div>
                            </div>
                            <button
                                onClick={handlePostInternship}
                                className="w-full mt-8 py-3 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wide hover:bg-black/90 transition-all flex items-center justify-center group shadow-xl shadow-black/20"
                            >
                                Post Internship
                                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="p-8 rounded-[2.5rem] glass-card border border-white/5 space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">Insights</h3>
                            <div className="space-y-4">
                                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-2 hover:border-amber-400/20 transition-all cursor-default group">
                                    <p className="text-[10px] font-medium tracking-wide opacity-40 uppercase group-hover:opacity-60 transition-opacity">Popular Skill</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold uppercase tracking-tight">AI Engineering</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">+14%</span>
                                    </div>
                                </div>
                                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-2 hover:border-amber-400/20 transition-all cursor-default group">
                                    <p className="text-[10px] font-medium tracking-wide opacity-40 uppercase group-hover:opacity-60 transition-opacity">Demand Gap</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold uppercase tracking-tight">Rust Architecture</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">-8%</span>
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
            className="p-6 rounded-[2rem] glass-card border border-white/5 group flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden hover:border-amber-400/20 transition-all"
        >
            <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none group-hover:text-amber-400/5 transition-colors">
                <Briefcase size={80} />
            </div>

            <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-3xl font-bold text-amber-400 shadow-xl shadow-amber-400/5 group-hover:scale-105 transition-transform">
                    {user.avatar}
                </div>
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-black border border-white/10 text-amber-400 shadow-lg">
                    <Zap size={12} className="fill-amber-400" />
                </div>
            </div>

            <div className="flex-1 space-y-4 text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-white">{user.name}</h3>
                        <p className="text-xs font-medium text-white/40 uppercase tracking-wide">{user.major} @ {user.school} <span className="text-amber-400/50 mx-1">•</span> Class of {user.gradYear}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleConnect}
                            disabled={connecting}
                            className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-white text-black transition-all text-xs font-bold uppercase tracking-wide disabled:opacity-50"
                        >
                            {connecting ? "Sending..." : "Message"}
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill: string) => (
                        <span key={skill} className="px-3 py-1 rounded-lg bg-amber-400/5 border border-amber-400/10 text-[10px] font-bold text-amber-400/80 uppercase tracking-wide">{skill}</span>
                    ))}
                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/20 uppercase tracking-wide">{user.hackathons} Events</span>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <Award size={14} className="text-amber-400" />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wide">Top Rated</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Github size={14} className="text-white/20" />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wide">Active Contributor</span>
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
            className="p-6 rounded-[2rem] glass-card border border-white/5 group flex items-center gap-6 hover:border-amber-400/20 transition-all cursor-default"
        >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-2xl font-bold text-white group-hover:scale-105 transition-transform">
                {team.name[0]}
            </div>
            <div className="flex-1 min-w-0 space-y-1 text-left">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{team.name}</h3>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">High Potential</span>
                </div>
                <p className="text-xs text-white/40 truncate font-medium">{team.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                    <div className="flex items-center space-x-1.5 text-[10px] font-medium text-white/40">
                        <Users size={12} />
                        <span>{(team.currentMembers || []).length} Members</span>
                    </div>
                    <button
                        onClick={() => toast.success("Opening pitch deck...")}
                        className="text-[10px] font-bold text-amber-400 uppercase tracking-wider hover:text-white transition-colors"
                    >
                        View Pitch Deck
                    </button>
                </div>
            </div>
            <ChevronRight size={20} className="text-white/20 group-hover:text-amber-400 transition-all" />
        </motion.div>
    );
}

