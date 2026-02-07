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

            toast.success("Project Posted", {
                description: "Your project is now live."
            });
            onClose();
            setFormData({ title: "", description: "", skills: "", timeline: "48 Hours" });
        } catch (error) {
            console.error("Idea posting error:", error);
            toast.error("Failed to post project. Please try again.");
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
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                                        <Lightbulb size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Post an Idea</h2>
                                        <p className="text-xs text-white/50 mt-1">Share your project with the community</p>
                                    </div>
                                </div>
                                <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6 md:col-span-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/60 ml-1">Project Title</label>
                                        <div className="relative group">
                                            <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-400 transition-colors" />
                                            <input
                                                required
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="e.g. AI-Powered Recycling"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-amber-400/50 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/60 ml-1">Description</label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Define the problem you are solving..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-amber-400/50 focus:bg-white/[0.08] outline-none transition-all h-32 resize-none placeholder:text-white/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/60 ml-1">Skills Needed</label>
                                    <div className="relative group">
                                        <Code size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-400 transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            value={formData.skills}
                                            onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                                            placeholder="e.g. React, Node.js, Python"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-amber-400/50 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/60 ml-1">Timeline</label>
                                    <div className="relative group">
                                        <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-400 transition-colors" />
                                        <select
                                            value={formData.timeline}
                                            onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white/80 focus:border-amber-400/50 focus:bg-white/[0.08] outline-none transition-all appearance-none"
                                        >
                                            <option className="bg-[#1a1a1a]">24 Hours</option>
                                            <option className="bg-[#1a1a1a]">48 Hours</option>
                                            <option className="bg-[#1a1a1a]">72 Hours</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex items-center justify-end border-t border-white/5">
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="px-6 py-2.5 bg-amber-400 text-black rounded-lg font-bold text-sm hover:bg-amber-500 transition-all flex items-center shadow-lg shadow-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {submitting ? "Posting..." : "Post Idea"}
                                    <Send size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
