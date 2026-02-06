"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Rocket,
    Mail,
    Lock,
    User,
    Github,
    ArrowRight,
    ShieldCheck,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();
    const [isFocused, setIsFocused] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        // Simulate biometric/validation delay
        setTimeout(() => {
            setIsLoading(false);
            router.push('/onboarding');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#050505] cyber-grid flex items-center justify-center p-6">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[3rem] overflow-hidden glass border border-white/5 shadow-2xl">

                {/* Left Side: Brand/Visual */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
                        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[80px]" />
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <Rocket className="text-white fill-white/20" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                            Hack<span className="text-primary">Nect</span>
                        </span>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl font-black text-white leading-tight italic uppercase tracking-tighter">
                            Orchestrate Your <br />
                            <span className="text-gradient">Next Mission</span>
                        </h2>
                        <p className="text-white/40 font-medium text-sm max-w-md leading-relaxed">
                            Join 24,000+ visionaries. Our AI-protocol ensures you only match with teammates who complement your tactical arsenal.
                        </p>

                        <div className="flex items-center space-x-4 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-xl border-2 border-black bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">+{i}k</div>
                                ))}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Participants Active</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-8 text-[10px] font-black uppercase tracking-widest text-white/20">
                        <div className="flex items-center space-x-2"><ShieldCheck size={14} /> <span>Biometric Secure</span></div>
                        <div className="flex items-center space-x-2"><Zap size={14} className="fill-white/20" /> <span>AI-Match Protocol</span></div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="bg-black/40 backdrop-blur-3xl p-12 lg:p-20 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full space-y-10">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-2 tracking-tight italic uppercase">Initialize Account</h1>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Enter credentials to begin discovery</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSignup}>
                            <div className="space-y-4">
                                <FormInput
                                    icon={<User size={18} />}
                                    label="Full Name"
                                    placeholder="e.g. Alex Hunter"
                                    onFocus={() => setIsFocused("name")}
                                    onBlur={() => setIsFocused(null)}
                                    isFocused={isFocused === "name"}
                                    required
                                />
                                <FormInput
                                    icon={<Mail size={18} />}
                                    label="Mission Email"
                                    placeholder="name@agency.com"
                                    onFocus={() => setIsFocused("email")}
                                    onBlur={() => setIsFocused(null)}
                                    isFocused={isFocused === "email"}
                                    type="email"
                                    required
                                />
                                <FormInput
                                    icon={<Lock size={18} />}
                                    label="Access Key"
                                    type="password"
                                    placeholder="••••••••"
                                    onFocus={() => setIsFocused("password")}
                                    onBlur={() => setIsFocused(null)}
                                    isFocused={isFocused === "password"}
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input type="checkbox" required className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-primary ring-offset-black" />
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">I agree to the Tactical Engagement Terms</label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/20 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Scanning Biometrics..." : "Create Account"}
                                {!isLoading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]"><span className="bg-[#0a0a0a] px-4 text-white/20 uppercase font-sans">Or External Protocol</span></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ExternalLoginBtn icon={<Github size={18} />} label="GitHub" />
                            <ExternalLoginBtn icon={<div className="w-4 h-4 bg-white/10 rounded-full" />} label="Google" />
                        </div>

                        <p className="text-center text-[10px] font-bold text-white/20 uppercase tracking-widest">
                            Already have an account? <Link href="/login" className="text-primary hover:underline">Begin Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormInput({ icon, label, placeholder, type = "text", onFocus, onBlur, isFocused }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">{label}</label>
            <div className={cn(
                "relative rounded-2xl border transition-all duration-300",
                isFocused ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-white/5 bg-white/5"
            )}>
                <div className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                    isFocused ? "text-primary" : "text-white/20"
                )}>
                    {icon}
                </div>
                <input
                    type={type}
                    placeholder={placeholder}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className="w-full bg-transparent p-5 pl-12 text-sm text-white placeholder:text-white/10 focus:outline-none"
                />
            </div>
        </div>
    );
}

function ExternalLoginBtn({ icon, label }: any) {
    return (
        <button className="flex items-center justify-center space-x-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest text-white/60">
            {icon}
            <span>{label}</span>
        </button>
    );
}
