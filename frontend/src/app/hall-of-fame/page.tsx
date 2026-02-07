"use client";

import React from "react";
import {
    Trophy,
    Star,
    Award,
    ChevronLeft,
    TrendingUp,
    Zap,
    Shield
} from "lucide-react";
import { MOCK_LEGENDS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HallOfFame() {
    const router = useRouter();

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
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter flex items-center space-x-3">
                            <Trophy className="text-amber-400" />
                            <span>Hall of <span className="text-amber-400">Fame</span></span>
                        </h1>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-16 space-y-16 max-w-6xl">
                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 mb-2"
                    >
                        <Star size={12} className="fill-amber-400" />
                        <span>All-Time Top Performers</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none"
                    >
                        The <span className="text-gradient">Legends</span> of HackNect
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        Celebrating the top developers and innovators who have excelled in the HackNect community.
                    </motion.p>
                </div>

                {/* Legend Grid */}
                <div className="grid grid-cols-1 gap-12">
                    {MOCK_LEGENDS.map((legend, idx) => (
                        <LegendCard key={legend.id} legend={legend} index={idx} />
                    ))}
                </div>

                {/* Footer Insight */}
                <div className="p-10 rounded-[3rem] bg-gradient-to-br from-amber-400/5 to-orange-500/5 border border-amber-400/10 text-center space-y-4">
                    <h3 className="text-xl font-black uppercase italic tracking-tight text-white">Your Turn Next?</h3>
                    <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
                        Your current performance shows great potential. Keep participating in events to earn your spot.
                    </p>
                </div>
            </main>
        </div>
    );
}

function LegendCard({ legend, index }: { legend: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-1 rounded-[3rem] bg-gradient-to-r from-amber-400/20 via-transparent to-amber-400/20 group"
        >
            <div className="p-10 rounded-[2.9rem] bg-black/90 backdrop-blur-xl flex flex-col md:flex-row items-center gap-10">
                <div className="relative">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-5xl font-black text-amber-400 shadow-2xl shadow-amber-400/5 rotate-3 group-hover:rotate-0 transition-transform">
                        {legend.avatar}
                    </div>
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-xl font-black shadow-xl">
                        #{legend.rank}
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter">{legend.name}</h3>
                            <p className="text-sm font-bold text-amber-400/80 uppercase tracking-widest flex items-center space-x-2 justify-center md:justify-start">
                                <Award size={14} />
                                <span>{legend.achievement}</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Score</span>
                            <span className="text-3xl font-black text-white italic tracking-tighter">{legend.score}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-4">
                        {legend.tech.map((t: string) => (
                            <span key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest">{t}</span>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:flex flex-col space-y-3">
                    <InsightTag icon={<TrendingUp size={12} />} label="Top Rated" />
                    <InsightTag icon={<Zap size={12} />} label="Highly Active" />
                    <InsightTag icon={<Shield size={12} />} label="Expert" />
                </div>
            </div>
        </motion.div>
    );
}

function InsightTag({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/30 truncate">
            {icon}
            <span>{label}</span>
        </div>
    );
}
