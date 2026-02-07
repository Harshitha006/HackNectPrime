"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Rocket,
    Mail,
    Lock,
    Github,
    ArrowRight,
    ShieldCheck,
    Zap,
    Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [isFocused, setIsFocused] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate identity scan delay
        setTimeout(() => {
            setIsLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#08080a] flex items-center justify-center p-6">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[3rem] overflow-hidden glass border border-white/5 shadow-2xl">

                {/* Left Side: Brand/Visual (Same as Signup for consistency) */}
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
                        <h2 className="text-3xl font-bold text-white leading-tight">
                            Welcome Back to <br />
                            <span className="text-primary">HackNect</span>
                        </h2>
                        <p className="text-white/40 font-medium text-sm max-w-md leading-relaxed">
                            Scan your credentials to re-initialize your dashboard. Your teams are waiting for synchronization.
                        </p>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5 space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group">
                                <Fingerprint size={24} className="group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Identity Scan</p>
                                <p className="text-xs text-white/50">Secure Login</p>
                            </div>
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
                            <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
                            <p className="text-white/50 text-sm">Enter your credentials to access your account</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-4">
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
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    onFocus={() => setIsFocused("password")}
                                    onBlur={() => setIsFocused(null)}
                                    isFocused={isFocused === "password"}
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" className="w-4 h-4 rounded bg-white/5 border-white/10 text-primary focus:ring-primary ring-offset-black" />
                                    <label className="text-xs text-white/50">Remember me</label>
                                </div>
                                <Link href="#" className="text-xs text-primary hover:underline">Forgot Password?</Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Logging in..." : "Sign In"}
                                {!isLoading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <div className="relative flex justify-center text-xs text-white/40 uppercase"><span className="bg-[#0a0a0a] px-4">Or continue with</span></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ExternalLoginBtn icon={<Github size={18} />} label="GitHub" />
                            <ExternalLoginBtn icon={<div className="w-4 h-4 bg-white/10 rounded-full" />} label="Google" />
                        </div>

                        <p className="text-center text-xs text-white/40">
                            Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormInput({ icon, label, placeholder, type = "text", onFocus, onBlur, isFocused }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/60 ml-1">{label}</label>
            <div className={cn(
                "relative rounded-xl border transition-all duration-300",
                isFocused ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-white/10 bg-white/5"
            )}>
                <div className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                    isFocused ? "text-primary" : "text-white/40"
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
        <button className="flex items-center justify-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium text-xs text-white/70">
            {icon}
            <span>{label}</span>
        </button>
    );
}
