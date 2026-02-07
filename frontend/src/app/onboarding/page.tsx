"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    GraduationCap,
    Code,
    Wrench,
    Heart,
    Camera,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Settings2,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STEPS = [
    { id: "basic", title: "Profile", icon: User },
    { id: "skills", title: "Skills", icon: Wrench },
    { id: "interests", title: "Interests", icon: Heart },
];

interface FormData {
    name: string;
    major: string;
    year: string;
    bio: string;
    skills: string[];
    interests: string[];
}

export default function Onboarding() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        major: "",
        year: "",
        bio: "",
        skills: [] as string[],
        interests: [] as string[],
    });

    const nextStep = () => {
        setCurrentStep((s: number) => Math.min(s + 1, STEPS.length - 1));
    };
    const prevStep = () => setCurrentStep((s: number) => Math.max(s - 1, 0));

    const handleSync = () => {
        setIsSubmitting(true);
        toast.success("Saving profile...", { description: "Setting up your HackNect experience." });
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Welcome!", { description: "You are all set." });
            router.push('/dashboard');
        }, 2000);
    };

    const toggleSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    return (
        <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-6 selection:bg-primary/30">
            <div className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />

                {/* Progress Bar */}
                <div className="flex h-1.5 bg-white/5">
                    {STEPS.map((step, idx) => (
                        <div
                            key={step.id}
                            className={cn(
                                "flex-1 transition-all duration-1000 ease-out",
                                idx <= currentStep ? "bg-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]" : "bg-transparent"
                            )}
                        />
                    ))}
                </div>

                <div className="p-12 md:p-16">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                                {React.createElement(STEPS[currentStep].icon, { size: 24 })}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{STEPS[currentStep].title}</h2>
                                <p className="text-xs font-medium text-white/40 mt-1">{STEPS[currentStep].title === "Profile" ? "Basics" : "Details"}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-primary tracking-wide">HACKNECT</span>
                            <p className="text-[10px] font-medium text-white/40 uppercase tracking-wide mt-1">Step {currentStep + 1} of 3</p>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                            className="min-h-[400px]"
                        >
                            {currentStep === 0 && (
                                <div className="space-y-8">
                                    <div className="flex flex-col items-center mb-8">
                                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative hover:bg-white/10 hover:border-primary/50 cursor-pointer group transition-all">
                                            <Camera className="text-white/20 group-hover:text-primary transition-colors" size={28} />
                                            <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-primary text-white shadow-lg">
                                                <User size={14} />
                                            </div>
                                        </div>
                                        <p className="text-xs text-white/40 mt-3 font-medium">Profile Picture</p>
                                    </div>

                                    <FormGroup
                                        label="Full Name"
                                        placeholder="e.g. Alex Hunter"
                                        icon={<User size={18} />}
                                        value={formData.name}
                                        onChange={(val) => setFormData(prev => ({ ...prev, name: val }))}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormGroup
                                            label="Major"
                                            placeholder="e.g. Computer Science"
                                            icon={<GraduationCap size={18} />}
                                            value={formData.major}
                                            onChange={(val) => setFormData(prev => ({ ...prev, major: val }))}
                                        />
                                        <FormGroup
                                            label="Year of Study"
                                            placeholder="e.g. Senior"
                                            icon={<Settings2 size={18} />}
                                            value={formData.year}
                                            onChange={(val) => setFormData(prev => ({ ...prev, year: val }))}
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-10">
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                        {["Python", "Go", "Rust", "TensorFlow", "UI Design", "Kubernetes"].map((skill) => (
                                            <SkillOption
                                                key={skill}
                                                label={skill}
                                                selected={formData.skills.includes(skill)}
                                                onClick={() => toggleSkill(skill)}
                                            />
                                        ))}
                                    </div>
                                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-2xl" />
                                        <div className="flex items-start space-x-3">
                                            <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
                                            <p className="text-xs leading-relaxed text-white/50 font-medium">
                                                <span className="text-primary font-bold mr-1">Tip:</span>
                                                High demand for Rust and TensorFlow this week.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-white/50 ml-1">Bio</label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all resize-none font-medium placeholder:text-white/20"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-white/50 ml-1">Interests</label>
                                        <div className="flex flex-wrap gap-2">
                                            {["FinTech", "BioTech", "AeroSpace", "Web3", "CyberSec", "Robotics"].map(i => (
                                                <span
                                                    key={i}
                                                    onClick={() => toggleInterest(i)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-lg border transition-all text-xs font-bold cursor-pointer",
                                                        formData.interests.includes(i)
                                                            ? "bg-primary/20 border-primary text-white"
                                                            : "bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                                                    )}
                                                >
                                                    {i}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-12 pt-10 border-t border-white/5">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 0 || isSubmitting}
                            className={cn(
                                "w-14 h-14 flex items-center justify-center rounded-2xl glass hover:bg-white/10 text-white transition-all disabled:opacity-0",
                                currentStep === 0 ? "pointer-events-none" : ""
                            )}
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <button
                            onClick={currentStep === STEPS.length - 1 ? handleSync : nextStep}
                            disabled={isSubmitting}
                            className="px-8 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm flex items-center shadow-lg shadow-primary/20 transition-all active:scale-95 group disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : (currentStep === STEPS.length - 1 ? "Complete" : "Next")}
                            {!isSubmitting && <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormGroup({ label, placeholder, icon, value, onChange }: { label: string, placeholder: string, icon: React.ReactNode, value: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-white/50 ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">
                    {icon}
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-white/20"
                />
            </div>
        </div>
    );
}

function SkillOption({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between",
                selected
                    ? "bg-primary/20 border-primary text-white"
                    : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
            )}
        >
            {label}
            {selected && <CheckCircle2 size={14} className="text-primary" />}
        </button>
    );
}
