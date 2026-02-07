"use client";

import React, { useState } from "react";
import {
    Sparkles,
    Lightbulb,
    ArrowRight,
    Users,
    Globe,
    Zap,
    ChevronLeft,
    Code
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IdeaProposalModal } from "@/components/IdeaProposalModal";

const MOCK_IDEAS = [
    {
        id: "i1",
        title: "Smart Logistics Network",
        description: "A decentralized system for coordinating urban logistics drones using efficient mesh networks.",
        author: "NeoMatrix",
        needed: ["Blockchain", "IoT", "C++"],
        applicants: 12,
        daysLeft: 3
    },
    {
        id: "i2",
        title: "Immersive Audio Gen",
        description: "Generating immersive 3D acoustic environments from text prompts using diffusion models.",
        author: "SonicBoom",
        needed: ["Python", "PyTorch", "DSP"],
        applicants: 8,
        daysLeft: 5
    }
];

export default function ReverseHackathon() {
    const router = useRouter();
    const [isProposalOpen, setIsProposalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#08080a] text-white selection:bg-primary/30">
            <IdeaProposalModal
                isOpen={isProposalOpen}
                onClose={() => setIsProposalOpen(false)}
            />

            {/* Header */}
            <nav className="border-b border-white/5 bg-black/40 backdrop-blur-3xl sticky top-0 z-50 h-20 flex items-center">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold tracking-tight uppercase">Project <span className="text-primary">First</span></h1>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-16 space-y-16 max-w-6xl">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-2">
                        <Sparkles size={12} />
                        <span>Project Ideas</span>
                    </div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight"
                    >
                        Assemble Around <span className="text-primary">Innovation</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 font-medium max-w-2xl mx-auto leading-relaxed text-sm"
                    >
                        Don't have a team? Start with a concept. The community will help make it a reality.
                    </motion.p>
                </div>

                {/* Call to Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsProposalOpen(true)}
                        className="p-8 rounded-[2rem] bg-primary group hover:bg-primary/90 transition-all cursor-pointer relative overflow-hidden shadow-xl shadow-primary/20"
                    >
                        <div className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform">
                            <Lightbulb size={200} />
                        </div>
                        <div className="relative z-10 space-y-4 text-left">
                            <h3 className="text-2xl font-bold">Post an Idea</h3>
                            <p className="text-white/80 font-medium text-sm leading-relaxed">Define your project goals, set requirements, and find teammates.</p>
                            <div className="flex items-center space-x-2 text-xs font-bold pt-4 group-hover:translate-x-2 transition-transform">
                                <span>Create Proposal</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            const element = document.getElementById('project-feed');
                            element?.scrollIntoView({ behavior: 'smooth' });
                            toast.info("Loading ideas...");
                        }}
                        className="p-8 rounded-[2rem] glass border border-white/5 group hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden shadow-xl"
                    >
                        <div className="absolute -bottom-10 -right-10 text-white/5 group-hover:text-primary/5 transition-colors">
                            <Users size={200} />
                        </div>
                        <div className="relative z-10 space-y-4 text-left">
                            <h3 className="text-2xl font-bold text-white">Join a Concept</h3>
                            <p className="text-white/50 font-medium text-sm leading-relaxed">Browse high-potential project ideas and apply to be a foundational member.</p>
                            <div className="flex items-center space-x-2 text-xs font-bold pt-4 text-primary group-hover:translate-x-2 transition-transform">
                                <span>Browse Ideas</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Active Projects Feed */}
                <div id="project-feed" className="space-y-10 pt-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center space-x-2">
                            <Zap size={20} className="text-primary" />
                            <span>Live Ideas</span>
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {MOCK_IDEAS.map((idea, idx) => (
                            <IdeaCard key={idea.id} idea={idea} index={idx} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

interface Idea {
    id: string;
    title: string;
    description: string;
    author: string;
    needed: string[];
    applicants: number;
    daysLeft: number;
}

function IdeaCard({ idea, index }: { idea: Idea, index: number }) {
    const [applying, setApplying] = useState(false);

    const handleApply = () => {
        setApplying(true);
        setTimeout(() => {
            setApplying(false);
            toast.success("Application Sent", {
                description: `Your profile has been shared with ${idea.author}.`
            });
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-[2rem] glass-card border border-white/5 group relative overflow-hidden hover:border-primary/20 transition-all"
        >
            <div className="flex flex-col lg:flex-row lg:items-center gap-8 text-left">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-2 text-primary text-xs font-medium">
                        <Globe size={12} />
                        <span>Proposed by {idea.author}</span>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight mb-2">{idea.title}</h3>
                        <p className="text-white/50 font-medium leading-relaxed max-w-3xl text-sm">{idea.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {idea.needed.map((skill: string) => (
                            <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/60 flex items-center space-x-2">
                                <Code size={12} />
                                <span>{skill}</span>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="lg:w-64 shrink-0 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col justify-center space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wide">Applicants</span>
                        <span className="text-lg font-bold text-white">{idea.applicants}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wide">Days Left</span>
                        <span className="text-lg font-bold text-rose-400">{idea.daysLeft}d</span>
                    </div>
                    <button
                        onClick={handleApply}
                        disabled={applying}
                        className="w-full py-2.5 bg-white text-black rounded-lg font-bold text-xs hover:bg-primary hover:text-white transition-all shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {applying ? "Applying..." : "Join Team"}
                        {!applying && <ArrowRight size={14} className="ml-2 inline-block group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
