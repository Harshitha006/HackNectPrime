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
        <div className="min-h-screen bg-[#08080a] text-white selection:bg-primary/30">
            {/* Navbar */}
            <nav className="border-b border-white/5 bg-black/40 backdrop-blur-3xl sticky top-0 z-50 h-20 flex items-center">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold tracking-tight flex items-center space-x-2">
                            <Trophy size={20} className="text-amber-400" />
                            <span>Hall of <span className="text-amber-400">Fame</span></span>
                        </h1>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12 space-y-12 max-w-5xl">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-bold text-amber-400 mb-2"
                    >
                        <Star size={12} className="fill-amber-400" />
                        <span>Top Performers</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight text-white/90"
                    >
                        Legends of HackNect
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base text-white/50 max-w-xl mx-auto leading-relaxed"
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
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 text-center space-y-3">
                    <h3 className="text-lg font-bold text-white">Your Turn Next?</h3>
                    <p className="text-white/50 max-w-lg mx-auto text-sm">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-[2rem] glass-card border border-white/5 group bg-black/40 hover:bg-black/60 transition-colors"
        >
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-2xl font-bold text-amber-400 shadow-xl shadow-amber-400/5 group-hover:scale-105 transition-transform">
                        {legend.avatar}
                    </div>
                    <div className="absolute -top-2 -left-2 w-8 h-8 rounded-lg bg-black/80 border border-white/10 flex items-center justify-center text-sm font-bold shadow-lg text-white">
                        #{legend.rank}
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-white">{legend.name}</h3>
                            <p className="text-xs font-medium text-amber-400/80 uppercase tracking-wide flex items-center space-x-2 justify-center md:justify-start mt-1">
                                <Award size={14} />
                                <span>{legend.achievement}</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                            <span className="text-xs font-medium text-white/40 uppercase tracking-wide">Score</span>
                            <span className="text-2xl font-bold text-white">{legend.score}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                        {legend.tech.map((t: string) => (
                            <span key={t} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/50">{t}</span>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:flex flex-col space-y-2">
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
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/40 truncate">
            {icon}
            <span>{label}</span>
        </div>
    );
}
