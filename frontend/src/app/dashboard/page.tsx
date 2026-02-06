"use client";

import React from "react";
import {
    Search,
    Bell,
    Settings,
    Calendar,
    Users as UsersIcon,
    Trophy,
    TrendingUp,
    LayoutDashboard,
    LogOut,
    MapPin,
    Clock,
    ExternalLink,
    ChevronRight,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import { MOCK_HACKATHONS, MOCK_TEAMS, MOCK_USER } from "@/lib/mock-data";
import { cn, formatScore, getScoreColor } from "@/lib/utils";
import { motion } from "framer-motion";
import { NotificationCenter } from "@/components/NotificationCenter";
import { JoinRequestModal } from "@/components/JoinRequestModal";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard() {
    const router = useRouter();
    const [requestModal, setRequestModal] = React.useState({
        isOpen: false,
        teamName: "",
        roleNeeded: ""
    });
    const [searchQuery, setSearchQuery] = React.useState("");

    const handleLogout = () => {
        toast.info("Terminating session... Identity secured.");
        setTimeout(() => router.push('/login'), 1000);
    };

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery) {
            toast.success(`Scanning network for: ${searchQuery.toUpperCase()}`);
            setSearchQuery("");
        }
    };

    React.useEffect(() => {
        const bootSequence = [
            "Initializing Mission Control...",
            "Decrypting Tactical Data...",
            "Neural Link Synchronized.",
        ];

        bootSequence.forEach((msg, i) => {
            setTimeout(() => {
                if (i === bootSequence.length - 1) {
                    toast.success(msg, { description: "Identity verified: Harshitha_Agent_01" });
                } else {
                    toast(msg);
                }
            }, i * 600);
        });
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex selection:bg-primary/30 relative">
            {/* Phase Voyager: Global Integrity Bridge */}
            <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end space-y-4">
                <div className="flex flex-col items-end space-y-2 opacity-0 hover:opacity-100 transition-all transform translate-y-4 hover:translate-y-0 group-hover:block hidden group-focus-within:block">
                    {[
                        { label: "Landing Zone", path: "/", color: "bg-white/10" },
                        { label: "Auth Sector", path: "/login", color: "bg-white/10" },
                        { label: "Onboarding", path: "/onboarding", color: "bg-primary/20 text-primary border-primary/30" },
                        { label: "Intel Feed", path: "/events", color: "bg-white/10" },
                        { label: "Reverse Hack", path: "/teams/reverse", color: "bg-white/10" },
                        { label: "Startup Portal", path: "/startup", color: "bg-amber-400/20 text-amber-400 border-amber-400/30" },
                    ].map((phase, i) => (
                        <button
                            key={i}
                            onClick={() => router.push(phase.path)}
                            className={cn(
                                "px-4 py-2 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest backdrop-blur-xl transition-all hover:scale-110 active:scale-95",
                                phase.color
                            )}
                        >
                            {phase.label}
                        </button>
                    ))}
                </div>
                <button
                    className="w-16 h-16 rounded-[2rem] bg-primary shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center group relative overflow-hidden transition-all hover:rotate-90 active:scale-90"
                    onClick={() => toast.info("Bridge Active", { description: "Global phase navigation enabled via hovering." })}
                >
                    <LayoutDashboard size={24} className="text-white group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>
            </div>

            <JoinRequestModal
                isOpen={requestModal.isOpen}
                onClose={() => setRequestModal(prev => ({ ...prev, isOpen: false }))}
                teamName={requestModal.teamName}
                roleNeeded={requestModal.roleNeeded}
            />
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-3xl hidden lg:flex flex-col">
                <div className="p-8 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic">
                        Hack<span className="text-primary">Nect</span>
                    </span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <SidebarItem icon={<LayoutDashboard size={18} />} label="Mission Feed" active />
                    <SidebarItem icon={<Calendar size={18} />} label="Global Events" onClick={() => router.push('/events')} />
                    <SidebarItem icon={<UsersIcon size={18} />} label="Reverse Mode" onClick={() => router.push('/teams/reverse')} />
                    <SidebarItem icon={<Trophy size={18} />} label="Hall of Fame" onClick={() => toast("Elite Database Access Only", { description: "You need 2,500 more alignment points." })} />
                    <div className="pt-10 px-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4">Classified Assets</p>
                        <SidebarItem
                            icon={<Sparkles size={18} className="text-amber-400" />}
                            label="Startup Portal"
                            isPremium
                            onClick={() => router.push('/startup')}
                        />
                    </div>
                </nav>

                <div className="p-6 border-t border-white/5">
                    <div
                        onClick={handleLogout}
                        className="group flex items-center space-x-3 px-3 py-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black relative">
                            {MOCK_USER.avatar}
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black truncate text-white italic uppercase tracking-tight">{MOCK_USER.name}</p>
                            <p className="text-[9px] text-white/30 truncate uppercase font-bold tracking-widest">{MOCK_USER.major}</p>
                        </div>
                        <LogOut size={14} className="text-white/20 group-hover:text-rose-400 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-y-auto cyber-grid scrollbar-hide">
                {/* Header */}
                <header className="sticky top-0 z-30 glass border-b border-white/5 p-4 md:px-10 h-20 flex items-center">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-6">
                            <div className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <TrendingUp size={20} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-black italic uppercase tracking-tighter leading-none">Mission <span className="text-primary">Central</span></h1>
                                <div className="flex items-center space-x-2 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/80">System: Operational</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="relative group hidden xl:block">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    placeholder="SCAN FOR MISSIONS..."
                                    className="bg-white/5 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-[10px] font-black tracking-widest w-72 focus:border-primary/50 focus:bg-white/[0.07] outline-none transition-all"
                                />
                            </div>
                            <div className="flex items-center space-x-3">
                                <NotificationCenter />
                                <button
                                    onClick={() => toast.info("System Configuration", { description: "Encryption layer v4.3 active." })}
                                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 group transition-all"
                                >
                                    <Settings size={18} className="text-white/40 group-hover:text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatCard label="Compatibility Rank" value="#12" change="+3%" icon={<TrendingUp size={16} />} />
                        <StatCard label="Active Requests" value="04" change="SECURED" icon={<ShieldCheck size={16} />} />
                        <StatCard label="Missions Joined" value="02" icon={<Calendar size={16} />} />
                        <StatCard label="Elite Percentile" value="0.5%" icon={<Trophy size={16} />} />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        {/* Left Column: Recommendations */}
                        <div className="xl:col-span-2 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center space-x-3">
                                    <Sparkles size={24} className="text-primary animate-pulse" />
                                    <span className="text-gradient">Tactical Alignment</span>
                                </h2>
                                <button
                                    onClick={() => router.push('/events')}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white transition-colors flex items-center"
                                >
                                    Expand View <ChevronRight size={14} className="ml-1" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {MOCK_TEAMS.map((team, idx) => (
                                    <TeamCard
                                        key={team.id}
                                        team={team}
                                        index={idx}
                                        onRespond={() => setRequestModal({
                                            isOpen: true,
                                            teamName: team.name,
                                            roleNeeded: team.rolesNeeded[0] || "Strategic Member"
                                        })}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Events & Profile */}
                        <div className="space-y-10">
                            {/* Mission Tracker */}
                            <div className="space-y-6">
                                <h2 className="text-sm font-black italic uppercase tracking-widest text-white/50 border-l-2 border-primary pl-4">Live Missions</h2>
                                <div className="space-y-4">
                                    {MOCK_HACKATHONS.map(event => (
                                        <EventMiniCard key={event.id} event={event} />
                                    ))}
                                </div>
                            </div>

                            {/* Tactical Arsenal Quick View */}
                            <div className="p-8 rounded-[2.5rem] glass border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
                                <h2 className="text-xs font-black italic uppercase tracking-[0.2em] text-white/90 mb-6">Your Arsenal</h2>
                                <div className="flex flex-wrap gap-2">
                                    {MOCK_USER.skills.map(skill => (
                                        <span key={skill} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-white/50 uppercase tracking-widest hover:border-primary/30 hover:text-primary transition-all cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div className="pt-8 mt-8 border-t border-white/5">
                                    <p className="text-[9px] uppercase font-black text-white/20 tracking-[0.3em] mb-4">Core Specialization</p>
                                    <div className="flex items-center space-x-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                        <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.5)] animate-pulse" />
                                        <span className="text-[11px] font-black text-white uppercase tracking-widest">Neural Orchestration</span>
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

function SidebarItem({ icon, label, active = false, isPremium = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, isPremium?: boolean, onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden",
                active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/40 hover:text-white hover:bg-white/5"
            )}>
            <div className="flex items-center space-x-3 relative z-10">
                <span className={cn("transition-colors", active ? "text-white" : "group-hover:text-primary")}>{icon}</span>
                <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
            </div>
            {isPremium && (
                <div className="px-2 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-[8px] font-black text-amber-400 uppercase tracking-tighter">PRIME</div>
            )}
            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary -z-10"
                />
            )}
        </div>
    );
}

function StatCard({ label, value, change, icon }: { label: string, value: string, change?: string, icon: React.ReactNode }) {
    return (
        <div className="p-6 rounded-3xl glass-card relative group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-xl bg-white/5 text-white/20 group-hover:text-primary transition-colors">{icon}</div>
                {change && (
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                        change.includes('+') ? "text-emerald-400 bg-emerald-400/5" : "text-primary bg-primary/5"
                    )}>
                        {change}
                    </span>
                )}
            </div>
            <p className="text-3xl font-black mb-1 italic tracking-tighter">{value}</p>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{label}</p>
        </div>
    );
}

function TeamCard({ team, index, onRespond }: { team: any, index: number, onRespond: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="p-8 rounded-[2.5rem] glass-card flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 relative group"
        >
            <div className="absolute top-0 right-0 w-1 bg-primary/20 h-full rounded-full group-hover:bg-primary transition-colors" />

            <div className="flex flex-col items-center space-y-4 shrink-0">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary via-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-primary/30 rotate-3 transition-transform group-hover:rotate-0">
                    {team.name[0]}
                </div>
                <div className={cn(
                    "px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 text-[12px] font-black uppercase tracking-widest",
                    getScoreColor(team.matchScore)
                )}>
                    {formatScore(team.matchScore)}
                </div>
            </div>

            <div className="flex-1 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{team.name}</h3>
                        <p className="text-xs text-white/40 font-medium leading-relaxed max-w-lg">{team.description}</p>
                    </div>
                    <button
                        onClick={onRespond}
                        className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-primary/20 active:scale-95"
                    >
                        Initiate Link
                    </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                    {team.rolesNeeded.map((role: string) => (
                        <span key={role} className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-rose-400/5 border border-rose-400/10 text-[9px] font-black text-rose-400 uppercase tracking-widest">
                            <UsersIcon size={12} />
                            <span>{role}</span>
                        </span>
                    ))}
                    {team.techStack.map((tech: string) => (
                        <span key={tech} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-white/30 uppercase tracking-widest group-hover:text-white/60 transition-colors">{tech}</span>
                    ))}
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-2.5">
                            {team.members.map((m: any, idx: number) => (
                                <div key={idx} className="w-8 h-8 rounded-xl bg-white/10 border-2 border-black flex items-center justify-center text-[10px] font-black ring-2 ring-primary/0 group-hover:ring-primary/20 transition-all">{m.avatar}</div>
                            ))}
                        </div>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Team Composition</span>
                    </div>
                    <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest italic flex items-center">
                        <Sparkles size={12} className="mr-2" />
                        SYNCHRONIZATION: <span className="ml-2 text-white">{team.matchReasons[0]}</span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

function EventMiniCard({ event }: { event: any }) {
    return (
        <div className="group p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="flex items-center space-x-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500">
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[8px] font-black text-primary uppercase tracking-[.3em] bg-primary/10 px-2 py-0.5 rounded-full">{event.type}</span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest italic">{event.date}</span>
                    </div>
                    <h4 className="text-sm font-black truncate text-white uppercase tracking-tight">{event.name}</h4>
                    <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1.5 text-[9px] text-white/30 font-black uppercase tracking-widest">
                            <MapPin size={10} className="text-primary/50" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight size={16} />
                </div>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
