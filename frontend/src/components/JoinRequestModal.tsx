"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Send,
    Sparkles,
    Zap,
    MessageSquare,
    Target,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JoinRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamName: string;
    roleNeeded: string;
}

export function JoinRequestModal({ isOpen, onClose, teamName, roleNeeded }: JoinRequestModalProps) {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            onClose();
        }, 1500);
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
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-xl glass border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none">
                            <Users size={160} />
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Join Team</h2>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-0.5">Team: {teamName} // Role: {roleNeeded}</p>
                                    </div>
                                </div>
                                <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2 italic">Introduction</label>
                                    <div className="relative group">
                                        <MessageSquare size={16} className="absolute left-5 top-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <textarea
                                            required
                                            placeholder="Tell us about yourself..."
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 pl-14 text-sm text-white focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all h-28 resize-none placeholder:text-white/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2 italic">Why join?</label>
                                    <div className="relative group">
                                        <Sparkles size={16} className="absolute left-5 top-5 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <textarea
                                            required
                                            placeholder="What skills do you bring?"
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 pl-14 text-sm text-white focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all h-28 resize-none placeholder:text-white/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2 italic">Pitch</label>
                                    <div className="relative group">
                                        <Target size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Your 1-line elevator pitch..."
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-14 pr-6 text-sm text-white focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-4 flex items-center justify-between">
                                <p className="text-[9px] font-bold text-white/20 italic max-w-[200px]">By submitting, you agree to our terms and community guidelines.</p>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center shadow-2xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {submitting ? "Sending..." : "Send Request"}
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
