"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

interface SkillData {
    skill: string;
    coverage: number; // 0 to 1
    ideal: number; // 0 to 1
}

interface SkillHeatmapProps {
    skills: SkillData[];
}

export function SkillHeatmap({ skills }: SkillHeatmapProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Tactical Coverage</h3>
                <span className="text-xs font-mono text-primary font-bold">Live Analysis</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {skills.map((item, idx) => {
                    const status = item.coverage >= 0.8 ? 'strong' : item.coverage >= 0.4 ? 'moderate' : 'critical';
                    const colorClass = status === 'strong' ? 'bg-emerald-500' : status === 'moderate' ? 'bg-amber-500' : 'bg-rose-500';
                    const textClass = status === 'strong' ? 'text-emerald-400' : status === 'moderate' ? 'text-amber-400' : 'text-rose-400';

                    return (
                        <motion.div
                            key={item.skill}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="space-y-2 group"
                        >
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", colorClass)} />
                                    <span className="font-bold text-white/80 group-hover:text-white transition-colors">{item.skill}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={cn("font-mono font-black", textClass)}>{Math.round(item.coverage * 100)}%</span>
                                    <span className="text-white/20">/</span>
                                    <span className="text-white/40 font-mono">{Math.round(item.ideal * 100)}%</span>
                                </div>
                            </div>

                            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                {/* Ideal Marker */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-white/20 z-10"
                                    style={{ left: `${item.ideal * 100}%` }}
                                />
                                {/* Coverage Bar */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.coverage * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                                    className={cn("h-full rounded-full shadow-lg", colorClass, "opacity-80")}
                                />
                            </div>

                            {status === 'critical' && (
                                <div className="flex items-center space-x-1 text-[9px] font-bold text-rose-400/60 uppercase tracking-tighter animate-pulse">
                                    <AlertCircle size={10} />
                                    <span>Recommendation: Recruit ML Specialist</span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <div className="pt-6 border-t border-white/5">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <CheckCircle2 size={18} className="text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Team Readiness</p>
                        <p className="text-lg font-black text-emerald-400">78% <span className="text-xs text-white/40 font-normal ml-1">Optimized</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
