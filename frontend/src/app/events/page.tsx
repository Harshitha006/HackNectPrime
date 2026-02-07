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
    Sparkles,
    ExternalLink as ExternalLinkIcon
} from "lucide-react";
import { MOCK_HACKATHONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Suspense } from "react";

function EventsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
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
            toast.success("Alerts enabled", { description: "You will receive notifications for new events." });
        } else {
            toast.info("Alerts disabled");
        }
    };

    return (
        <div className="min-h-screen bg-[#08080a] text-white selection:bg-primary/30">
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
                        <h1 className="text-xl font-bold tracking-tight">Hack<span className="text-primary">Nect</span> Events</h1>
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
                                }}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all border",
                                    filter === cat
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div
                            onClick={handleOptIn}
                            className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all group"
                        >
                            <span className="text-xs font-medium text-white/60 group-hover:text-white">Notifications</span>
                            <div className={cn(
                                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                                isOptedIn ? "bg-primary" : "bg-white/10"
                            )}>
                                <div className={cn(
                                    "absolute h-3 w-3 rounded-full bg-white transition-all transform",
                                    isOptedIn ? "translate-x-5" : "translate-x-1"
                                )} />
                            </div>
                            <span className={cn(
                                "text-xs font-medium",
                                isOptedIn ? "text-primary" : "text-white/40"
                            )}>{isOptedIn ? "On" : "Off"}</span>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search events..."
                                className="w-full md:w-80 bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Hero Event (Featured) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => toast.info("Silicon Valley AI Summit", { description: "Opening event details." })}
                    className="relative rounded-[3rem] overflow-hidden group cursor-pointer aspect-[21/9] md:aspect-[3/1] border border-white/5"
                >
                    <img
                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200"
                        alt="Featured Event"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-10 md:p-16 flex flex-col justify-end">
                        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-primary text-xs font-bold text-white mb-6 w-fit">
                            <Sparkles size={14} />
                            <span>Featured Event</span>
                        </div>
                        <div className="max-w-3xl">
                            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight leading-none text-white">Silicon Valley <span className="text-primary">AI Summit</span> 2025</h2>
                            <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-white/70">
                                <div className="flex items-center space-x-2"><Calendar size={16} className="text-primary" /> <span>Feb 28 - Mar 02</span></div>
                                <div className="flex items-center space-x-2"><MapPin size={16} className="text-primary" /> <span>Palo Alto</span></div>
                                <div className="flex items-center space-x-2"><Trophy size={16} className="text-amber-400" /> <span>$250K Prize Pool</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-8 right-8 p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center backdrop-blur-md">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">Registration Closes</span>
                        <span className="text-xl font-bold text-white tracking-tight">24<span className="text-primary">:</span>12<span className="text-primary">:</span>09</span>
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
                            <p className="text-sm font-black text-white/20 uppercase tracking-[0.3em]">No events found</p>
                        </div>
                    )}
                </div>
            </main >
        </div >
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
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">{event.type}</div>
            </div>

            <div className="p-10 flex flex-col flex-1 relative">
                <div className="flex-1 space-y-6">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">{event.name}</h3>
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 opacity-0 group-hover:opacity-100 transition-all text-white/40 hover:text-primary hover:border-primary/20">
                            <ExternalLinkIcon size={18} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-primary"><Calendar size={12} /></div>
                            <span className="text-xs font-medium text-white/60">{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-primary"><MapPin size={12} /></div>
                            <span className="text-xs font-medium text-white/60">{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-md bg-amber-400/10 flex items-center justify-center text-amber-400"><Trophy size={12} /></div>
                            <span className="text-xs font-bold text-white">{event.prize} Pool</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                        <span className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">{event.theme}</span>
                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">Open</span>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center space-x-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60 shadow-sm">+{i}k</div>
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Participants</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toast.success(`Event: ${event.name}`, { description: "Redirecting to details..." });
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
export default function EventsFeed() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <EventsContent />
        </Suspense>
    );
}
