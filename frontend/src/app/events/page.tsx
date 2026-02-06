"use client";

import React, { useState } from "react";
import {
    Search,
    Filter,
    MapPin,
    Calendar,
    Globe,
    Trophy,
    ArrowRight,
    ChevronLeft,
    LayoutGrid,
    List as ListIcon,
    Zap,
    Tag,
    Sparkles
} from "lucide-react";
import { MOCK_HACKATHONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EventsFeed() {
    const router = useRouter();
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState("");
    const [isOptedIn, setIsOptedIn] = useState(false);

    const filteredEvents = MOCK_HACKATHONS.filter(event => {
        const matchesFilter = filter === 'All' || event.theme.toLowerCase() === filter.toLowerCase() || (filter === 'AI/ML' && event.theme === 'AI');
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.theme.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleOptIn = () => {
        const newState = !isOptedIn;
        setIsOptedIn(newState);
        if (newState) {
            toast.success("Intelligence Link Established", { description: "You will receive high-priority mission alerts." });
        } else {
            toast.info("Link Severed", { description: "Mission alerts have been silenced." });
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
            {/* Navbar */}
            <nav className="border-b border-white/5 bg-black/40 backdrop-blur-3xl sticky top-0 z-50 h-20 flex items-center">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Mission <span className="text-primary">Intel</span></h1>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                            <button
                                onClick={() => setView('grid')}
                                className={cn("p-2 rounded-lg transition-all", view === 'grid' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/40 hover:text-white")}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/40 hover:text-white")}
                            >
                                <ListIcon size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-16 space-y-16">
                {/* Filters & Search */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    <div className="flex items-center space-x-3 overflow-x-auto pb-4 xl:pb-0 scrollbar-hide">
                        {["All", "AI/ML", "Web3", "HealthTech", "FinTech", "CyberSec"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setFilter(cat);
                                    toast(`Sector Filter: ${cat.toUpperCase()}`, { icon: <Tag size={12} /> });
                                }}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border",
                                    filter === cat
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                        : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div
                            onClick={handleOptIn}
                            className="flex items-center space-x-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all group"
                        >
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/50">Mission Alerts</span>
                            <div className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                isOptedIn ? "bg-primary" : "bg-white/10"
                            )}>
                                <div className={cn(
                                    "absolute h-4 w-4 rounded-full bg-white transition-all transform",
                                    isOptedIn ? "translate-x-6" : "translate-x-1"
                                )} />
                            </div>
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest",
                                isOptedIn ? "text-primary" : "text-white/20"
                            )}>{isOptedIn ? "Active" : "Opt-In"}</span>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={14} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="SCAN GLOBAL REGISTRY..."
                                className="w-full md:w-80 bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-[10px] font-black tracking-widest focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/10"
                            />
                        </div>
                    </div>
                </div>

                {/* Hero Event (Featured) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => toast.info("Mission Briefing Initiated", { description: "Opening Silicon Valley AI Summit tactical overview." })}
                    className="relative rounded-[3rem] overflow-hidden group cursor-pointer aspect-[21/9] md:aspect-[3/1] border border-white/5"
                >
                    <img
                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200"
                        alt="Featured Event"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-10 md:p-16 flex flex-col justify-end">
                        <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-xl bg-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 w-fit shadow-2xl shadow-primary/50 ring-1 ring-white/20">
                            <Sparkles size={12} className="animate-pulse" />
                            <span>Alpha Mission</span>
                        </div>
                        <div className="max-w-3xl">
                            <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter italic uppercase italic leading-none">Silicon Valley <span className="text-primary">AI Summit</span> 2025</h2>
                            <div className="flex flex-wrap items-center gap-10 text-[11px] font-black uppercase tracking-widest text-white/60">
                                <div className="flex items-center space-x-3"><Calendar size={18} className="text-primary" /> <span>Feb 28 - Mar 02</span></div>
                                <div className="flex items-center space-x-3"><MapPin size={18} className="text-primary" /> <span>Palo Alto / Neural Link</span></div>
                                <div className="flex items-center space-x-3"><Trophy size={18} className="text-amber-400" /> <span>$250K GRANT</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-10 right-10 p-6 rounded-3xl glass border border-white/10 flex flex-col items-center backdrop-blur-2xl">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Registration Closes</span>
                        <span className="text-3xl font-black text-white italic tracking-tighter">24<span className="text-primary">:</span>12<span className="text-primary">:</span>09</span>
                    </div>
                </motion.div>

                {/* Event Grid */}
                <div className={cn(
                    "grid gap-10",
                    view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}>
                    {filteredEvents.length > 0 ? filteredEvents.map((event, idx) => (
                        <EventCard key={event.id} event={event} view={view} index={idx} />
                    )) : (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <Zap size={48} className="text-white/10 mx-auto" />
                            <p className="text-sm font-black text-white/20 uppercase tracking-[0.3em]">No Missions Detected in this Sector</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function EventCard({ event, view, index }: { event: any, view: 'grid' | 'list', index: number }) {
    const isList = view === 'list';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8 }}
            className={cn(
                "rounded-[2.5rem] overflow-hidden glass-card group cursor-pointer border border-white/5 relative",
                isList ? "flex items-stretch min-h-[300px]" : "flex flex-col"
            )}
        >
            <div className={cn(
                "relative overflow-hidden",
                isList ? "w-80 shrink-0" : "aspect-[16/10]"
            )}>
                <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <div className="absolute top-6 left-6 px-4 py-2 rounded-xl glass border border-white/20 text-[9px] font-black text-white uppercase tracking-[0.2em]">{event.type}</div>
            </div>

            <div className="p-10 flex flex-col flex-1 relative">
                <div className="flex-1 space-y-6">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-tight transition-colors group-hover:text-primary">{event.name}</h3>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 opacity-0 group-hover:opacity-100 transition-all text-white/40 hover:text-primary hover:border-primary/20">
                            <ExternalLink size={18} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary"><Calendar size={14} /></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary"><MapPin size={14} /></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400"><Trophy size={14} /></div>
                            <span className="text-[11px] font-black text-white italic tracking-tight">{event.prize} POOL</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-4">
                        <span className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-[0.2em]">{event.theme}</span>
                        <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-white/40 transition-colors">Combat Ready</span>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-9 h-9 rounded-xl border-2 border-black bg-white/10 flex items-center justify-center text-[10px] font-black text-white/40 shadow-xl group-hover:border-primary/20 transition-all">+{i}k</div>
                            ))}
                        </div>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Deployment</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toast.success(`Mission Initialized: ${event.name.toUpperCase()}`, { description: "Establishing tactical link..." });
                        }}
                        className="w-12 h-12 rounded-xl bg-primary hover:bg-white hover:text-black transition-all shadow-xl shadow-primary/30 flex items-center justify-center group-hover:scale-110 active:scale-95"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function ExternalLink({ size }: { size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
    );
}
