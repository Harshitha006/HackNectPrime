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
        title: "Autonomous Hive Mind",
        description: "A decentralized swarm intelligence for coordinating urban logistics drones using ultra-low latency mesh networks.",
        author: "NeoMatrix",
        needed: ["Blockchain", "IoT", "C++"],
        applicants: 12,
        daysLeft: 3
    },
    {
        id: "i2",
        title: "Neural Audio Synthesis",
        description: "Generating fully immersive 3D acoustic environments from textual prompts using latent diffusion models.",
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
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
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
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Idea <span className="text-primary">First</span></h1>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-16 space-y-16 max-w-6xl">
                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2"
                    >
                        <Sparkles size={12} />
                        <span>Reverse Hackathon Mode</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none"
                    >
                        Assemble Around <span className="text-gradient">Pure Vision</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        Don't have a team? Start with a concept. The AI will find the engineering core needed to make it reality.
                    </motion.p>
                </div>

                {/* Call to Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsProposalOpen(true)}
                        className="p-10 rounded-[3rem] bg-primary group hover:bg-primary/90 transition-all cursor-pointer relative overflow-hidden shadow-2xl shadow-primary/30"
                    >
                        <div className="absolute -bottom-10 -right-10 text-white/10 group-hover:scale-110 transition-transform">
                            <Lightbulb size={200} />
                        </div>
                        <div className="relative z-10 space-y-4 text-left">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter">Post a Core Idea</h3>
                            <p className="text-white/80 font-medium text-sm leading-relaxed">Define the objective, set the tech requirements, and let the scouts find you.</p>
                            <div className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest pt-4 group-hover:translate-x-2 transition-transform">
                                <span>Initialize Proposal</span>
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            const element = document.getElementById('project-feed');
                            element?.scrollIntoView({ behavior: 'smooth' });
                            toast.info("Accessing Inventory", { description: "Streaming live project proposals..." });
                        }}
                        className="p-10 rounded-[3rem] glass border border-white/5 group hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute -bottom-10 -right-10 text-white/5 group-hover:text-primary/5 transition-colors">
                            <Users size={200} />
                        </div>
                        <div className="relative z-10 space-y-4 text-left">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Join a Concept</h3>
                            <p className="text-white/40 font-medium text-sm leading-relaxed">Browse high-potential project ideas and apply to be a foundational member.</p>
                            <div className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest pt-4 text-primary group-hover:translate-x-2 transition-transform">
                                <span>Browse Inventory</span>
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Active Projects Feed */}
                <div id="project-feed" className="space-y-10 pt-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black uppercase italic tracking-tight flex items-center space-x-3">
                            <Zap size={24} className="text-primary" />
                            <span>Live Proposals</span>
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
            toast.success("Application Transmitted", {
                description: `Your profile has been shared with ${idea.author}.`
            });
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-10 rounded-[3rem] glass-card border border-white/5 group relative overflow-hidden hover:border-primary/20 transition-all"
        >
            <div className="flex flex-col lg:flex-row lg:items-center gap-10 text-left">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center space-x-3 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                        <Globe size={14} />
                        <span>Proposed by {idea.author}</span>
                    </div>
                    <div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">{idea.title}</h3>
                        <p className="text-white/40 font-medium leading-relaxed max-w-3xl">{idea.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {idea.needed.map((skill: string) => (
                            <span key={skill} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center space-x-2 group-hover:text-primary transition-colors">
                                <Code size={12} />
                                <span>{skill}</span>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="lg:w-72 shrink-0 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col justify-center space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Applicants</span>
                        <span className="text-lg font-black text-white">{idea.applicants}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Time Buffer</span>
                        <span className="text-lg font-black text-rose-400">{idea.daysLeft}d</span>
                    </div>
                    <button
                        onClick={handleApply}
                        disabled={applying}
                        className="w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {applying ? "Streaming Data..." : "Apply to Founder Core"}
                        {!applying && <ArrowRight size={14} className="ml-2 inline-block group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
