"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    MessageSquare,
    Settings,
    Plus,
    Users,
    Hash,
    Send,
    Github,
    Trophy,
    Calendar,
    Layout
} from "lucide-react";
import { MOCK_TEAMS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SkillHeatmap } from "@/components/SkillHeatmap";
import { MentorRadar } from "@/components/MentorRadar";

const SKILLS_ANALYSIS = [
    { skill: "Python / ML", coverage: 0.9, ideal: 0.8 },
    { skill: "React Frontend", coverage: 0.6, ideal: 0.9 },
    { skill: "Backend API", coverage: 0.8, ideal: 0.8 },
    { skill: "UI/UX Design", coverage: 0.2, ideal: 0.7 },
    { skill: "Cloud / DevOps", coverage: 0.4, ideal: 0.5 },
];

export default function TeamDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('hub');

    const team = MOCK_TEAMS.find(t => t.id === id) || MOCK_TEAMS[0];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col">
            {/* Header */}
            <nav className="glass border-b border-white/5 sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-white/5 transition-colors text-white/40 hover:text-white">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="h-8 w-[1px] bg-white/10 mx-2" />
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">{team.name}</h1>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] leading-none mt-1">Global AI Hackathon 2025</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="hidden md:flex -space-x-2 mr-4">
                            {team.members.map(m => (
                                <div key={m.name} className="w-8 h-8 rounded-lg bg-indigo-500 border-2 border-black flex items-center justify-center text-[10px] font-bold shadow-lg" title={m.name}>{m.avatar}</div>
                            ))}
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-primary text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Invite Members</button>
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"><Settings size={18} /></button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Left Sidebar: Nav */}
                <div className="w-full md:w-20 border-b md:border-b-0 md:border-r border-white/5 p-4 flex md:flex-col items-center justify-center md:justify-start space-x-4 md:space-x-0 md:space-y-6 bg-black/40">
                    <SidebarTab icon={<Layout size={20} />} active={activeTab === 'hub'} onClick={() => setActiveTab('hub')} />
                    <SidebarTab icon={<MessageSquare size={20} />} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
                    <SidebarTab icon={<Plus size={20} />} active={activeTab === 'roles'} onClick={() => setActiveTab('roles')} />
                    <SidebarTab icon={<Github size={20} />} active={activeTab === 'repo'} onClick={() => setActiveTab('repo')} />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 cyber-grid">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Hub */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Project Vision */}
                            <div className="p-8 rounded-[2.5rem] glass-card space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-black">Project Vision</h2>
                                    <div className="flex items-center space-x-2 text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                        <CheckCircle2Icon size={12} />
                                        <span>Status: Active</span>
                                    </div>
                                </div>
                                <p className="text-white/60 leading-relaxed font-light">
                                    {team.description} We're focusing on a sub-specialized model that can handle medical imagery data with high precision while maintaining a compact size for edge deployment.
                                </p>
                                <div className="flex flex-wrap gap-2 pt-4">
                                    {team.techStack.map(tech => (
                                        <span key={tech} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60">{tech}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Team Roster */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {team.members.map(member => (
                                    <div key={member.name} className="p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black">
                                            {member.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{member.name}</p>
                                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="p-4 rounded-3xl border-2 border-dashed border-white/5 flex items-center justify-center space-x-2 text-white/20 hover:text-white/40 cursor-pointer hover:border-white/10 transition-all group">
                                    <Plus size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">New Role</span>
                                </div>
                            </div>

                            {/* Real-time Feed (Mini Chat) */}
                            <div className="p-6 rounded-[2.5rem] glass-card flex flex-col h-80">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Transmission Feed</h3>
                                <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
                                    <ChatMessage user="John Doe" text="Just committed the initial model architecture" time="12:04" />
                                    <ChatMessage user="Sarah Smith" text="Frontend components for data viz are ready" time="12:15" />
                                    <ChatMessage user="John Doe" text="Great, let's look at the API integration next" time="12:16" />
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Send message to team..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs focus:border-primary/50 outline-none transition-all"
                                    />
                                    <button className="p-2 rounded-xl bg-primary shadow-lg shadow-primary/20"><Send size={16} /></button>
                                </div>
                            </div>
                        </div>

                        {/* Analytics & Mentors */}
                        <div className="space-y-8">
                            {/* Skill Gap Analysis */}
                            <div className="p-8 rounded-[2.5rem] glass-card">
                                <SkillHeatmap skills={SKILLS_ANALYSIS} />
                            </div>

                            {/* Mentor Radar */}
                            <MentorRadar />

                            {/* Important Details */}
                            <div className="p-6 rounded-[2rem] glass-card space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest">Mission Intel</h3>
                                <div className="space-y-3">
                                    <IntelRow icon={<Trophy size={14} />} label="Prize" value="$50,000" />
                                    <IntelRow icon={<Calendar size={14} />} label="Deadline" value="4d 12h" />
                                    <IntelRow icon={<Users size={14} />} label="Open Slots" value="2 / 5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SidebarTab({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-3 rounded-2xl transition-all duration-300",
                active
                    ? "bg-primary text-white shadow-xl shadow-primary/30"
                    : "text-white/20 hover:text-white hover:bg-white/5"
            )}
        >
            {icon}
        </button>
    );
}

function ChatMessage({ user, text, time }: { user: string, text: string, time: string }) {
    return (
        <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">{user}</span>
                <span className="text-[8px] font-bold text-white/20">{time}</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-light">{text}</p>
        </div>
    );
}

function IntelRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white/30">
                {icon}
                <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            </div>
            <span className="text-xs font-black text-white">{value}</span>
        </div>
    );
}

function CheckCircle2Icon({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
