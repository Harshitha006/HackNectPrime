"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Lightbulb,
    Send,
    Target,
    Code,
    Sparkles,
    Shield
} from "lucide-react";
import { toast } from "sonner";

interface IdeaProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

import { useAuth } from "@/contexts/AuthContext";
import { firestoreService } from "@/hooks/useFirestore";

export function IdeaProposalModal({ isOpen, onClose }: IdeaProposalModalProps) {
    const { user, profile } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        skills: "",
        timeline: "48 Hours"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Authentication Required");
            return;
        }

        setSubmitting(true);
        try {
            await firestoreService.createTeam({
                name: formData.title,
                description: formData.description,
                projectIdea: formData.description,
                skillsNeeded: formData.skills.split(',').map(s => s.trim()),
                rolesNeeded: ["Lead Developer", "Visionary"],
                status: "forming",
                adminId: user.uid,
                currentMembers: [user.uid],
                hackathonId: "global-ai-hackathon-2025" // Default for now
            });

            toast.success("Project Seeded", {
                description: "Your vision is now part of the global network."
            });
            onClose();
            setFormData({ title: "", description: "", skills: "", timeline: "48 Hours" });
        } catch (error) {
            console.error("Idea posting error:", error);
            toast.error("Neural uplink failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="relative w-full max-w-2xl glass border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-8">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                                        <Lightbulb size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Post an Idea</h2>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-0.5">Share your project with the community</p>
                                    </div>
                                </div>
                                <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6 md:col-span-2">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2 italic">Project Title</label>
                                        <div className="relative group">
                                            <Target size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-400 transition-colors" />
                                            <input
                                                required
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="e.g. Neural Mesh Network"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:border-amber-400/50 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2 italic">Description</label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Define the problem you are solving..."
                                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-sm text-white focus:border-amber-400/50 focus:bg-white/[0.08] outline-none transition-all h-32 resize-none placeholder:text-white/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2 italic">Skills Needed</label>
                                    <div className="relative group">
                                        <Code size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-400 transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            value={formData.skills}
                                            onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                                            placeholder="e.g. Rust, Go, WASM"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:border-amber-400/50 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2 italic">Timeline</label>
                                    <div className="relative group">
                                        <Shield size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-400 transition-colors" />
                                        <select
                                            value={formData.timeline}
                                            onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white/60 focus:border-amber-400/50 focus:bg-white/[0.08] outline-none transition-all appearance-none"
                                        >
                                            <option>24 Hours</option>
                                            <option>48 Hours</option>
                                            <option>72 Hours</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex items-center justify-between border-t border-white/5">
                                <div className="flex items-center space-x-3 text-amber-400/40">
                                    <Sparkles size={14} className="animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest italic">Matching Active</span>
                                </div>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="px-10 py-4 bg-amber-400 text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all flex items-center shadow-2xl shadow-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {submitting ? "Posting..." : "Post Idea"}
                                    <Send size={16} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
