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
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { firestoreService } from "@/hooks/useFirestore";

interface JoinRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamId: string;
    teamAdminId: string;
    teamName: string;
    roleNeeded: string;
}

export function JoinRequestModal({ isOpen, onClose, teamId, teamAdminId, teamName, roleNeeded }: JoinRequestModalProps) {
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        intro: "",
        why: "",
        pitch: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to join teams");
            return;
        }

        setSubmitting(true);
        try {
            const fullMessage = `Intro: ${formData.intro}\n\nWhy: ${formData.why}\n\nPitch: ${formData.pitch}`;

            await firestoreService.sendJoinRequest({
                fromUserId: user.uid,
                toTeamId: teamId,
                toAdminId: teamAdminId,
                message: fullMessage,
                roleApplyingFor: roleNeeded,
                status: "pending"
            });

            toast.success("Request Sent", {
                description: "Your request has been sent to the team leads."
            });
            onClose();
            setFormData({ intro: "", why: "", pitch: "" });
        } catch (error) {
            console.error("Join request error:", error);
            toast.error("Failed to send request. Please try again.");
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
                                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Join Team</h2>
                                        <p className="text-xs font-medium text-white/50 mt-1">Applying for <span className="text-white">{roleNeeded}</span> at <span className="text-white">{teamName}</span></p>
                                    </div>
                                </div>
                                <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/60 ml-1">Introduction</label>
                                    <div className="relative group">
                                        <MessageSquare size={16} className="absolute left-4 top-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <textarea
                                            required
                                            value={formData.intro}
                                            onChange={(e) => setFormData(prev => ({ ...prev, intro: e.target.value }))}
                                            placeholder="Tell us about yourself..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-11 text-sm text-white focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all h-24 resize-none placeholder:text-white/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/60 ml-1">Why do you want to join?</label>
                                    <div className="relative group">
                                        <Sparkles size={16} className="absolute left-4 top-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <textarea
                                            required
                                            value={formData.why}
                                            onChange={(e) => setFormData(prev => ({ ...prev, why: e.target.value }))}
                                            placeholder="What skills do you bring?"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-11 text-sm text-white focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all h-24 resize-none placeholder:text-white/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/60 ml-1">Elevator Pitch</label>
                                    <div className="relative group">
                                        <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            value={formData.pitch}
                                            onChange={(e) => setFormData(prev => ({ ...prev, pitch: e.target.value }))}
                                            placeholder="Your 1-line elevator pitch..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all placeholder:text-white/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-4 flex items-center justify-between">
                                <p className="text-xs text-white/30 max-w-[200px]">By submitting, you agree to our terms.</p>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all flex items-center shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {submitting ? "Sending..." : "Send Request"}
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
