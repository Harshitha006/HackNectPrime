"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, MessageSquare, AlertTriangle, UserPlus, Info, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function MentorRadar() {
    const [pulseScale, setPulseScale] = useState(1);
    const [isAlert, setIsAlert] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setPulseScale(s => s === 1 ? 1.05 : 1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden group">
            {/* Background Radar Effect */}
            <div className="absolute top-0 right-0 p-8 text-indigo-500/10 pointer-events-none group-hover:text-indigo-500/20 transition-colors">
                <Radar size={120} strokeWidth={1} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                            <Radar size={18} className="animate-spin-slow" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white tracking-tight">Mentor Radar™</h3>
                            <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest leading-none mt-1">Activity Analysis</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>SCANNING</span>
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-white/60">Chat Velocity</span>
                            <span className="text-indigo-400">High</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                className="h-full bg-indigo-500 shadow-sm shadow-indigo-500/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group/item">
                            <div className="p-2 rounded-lg bg-indigo-400/10 text-indigo-400 group-hover/item:bg-indigo-400 group-hover/item:text-white transition-all">
                                <MessageSquare size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">Keyword Friction Detected</p>
                                <p className="text-[10px] text-rose-400 truncate uppercase font-black animate-pulse">"NOT WORKING", "CORE ERROR"</p>
                            </div>
                        </div>

                        {!isAlert ? (
                            <div onClick={() => setIsAlert(true)} className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between group/suggest cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <Zap size={16} className="text-emerald-400 animate-bounce" />
                                    <div>
                                        <p className="text-xs font-bold text-emerald-200">Team is thriving</p>
                                        <p className="text-[9px] text-emerald-400/60 font-bold uppercase tracking-wider">No blockers detected</p>
                                    </div>
                                </div>
                                <Info size={14} className="text-emerald-400 group-hover/suggest:scale-110 transition-transform" />
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3"
                            >
                                <div className="flex items-center space-x-2 text-rose-400">
                                    <AlertTriangle size={16} />
                                    <p className="text-xs font-bold">Struggle Detected</p>
                                </div>
                                <p className="text-[10px] text-rose-200/60 leading-relaxed font-medium capitalize">Repeated technical blocks in chat. Suggesting AI Architecture mentor.</p>
                                <button className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center space-x-2">
                                    <UserPlus size={12} />
                                    <span>Request Specialized Mentor</span>
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
