"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Rocket,
  Zap,
  Search,
  MessageSquare,
  Trophy,
  Target,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Stars,
  Globe,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] cyber-grid selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Rocket className="text-white fill-white/20" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              Hack<span className="text-primary italic">Nect</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-10 text-xs font-black uppercase tracking-widest text-white/50">
            <Link href="#features" className="hover:text-primary transition-colors hover:scale-105">Features</Link>
            <Link href="#missions" className="hover:text-primary transition-colors hover:scale-105">Stats</Link>
            <Link href="/events" className="hover:text-primary transition-colors hover:scale-105">Events</Link>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <Link href="/login" className="hover:text-white transition-all">Login</Link>
            <Link href="/signup" className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 transition-all shadow-xl shadow-white/10">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 md:pt-56 md:pb-48 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 animate-pulse">
                <Stars size={14} className="fill-primary" />
                <span>AI Matching Live</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[0.9] italic">
                BUILD YOUR <br />
                <span className="text-gradient">DREAM TEAM</span>
              </h1>
              <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-wide">
                The AI-powered platform for hackathons. Connect with developers, designers, and innovators and build something amazing together.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="/onboarding"
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/40 flex items-center justify-center group"
                >
                  Join HackNect
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/events"
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl glass hover:bg-white/5 text-white font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center"
                >
                  Explore Events
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Stats Section */}
      <section id="missions" className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem label="Participants" value="24.5k+" />
            <StatItem label="Teams Formed" value="8.2k+" />
            <StatItem label="Events Hosted" value="450+" />
            <StatItem label="Prize Pool" value="$12.4M" />
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter italic">Platform Features</h2>
            <p className="text-white/40 max-w-xl mx-auto font-bold text-xs uppercase tracking-widest leading-loose">Built to help you find the perfect team and win your next hackathon.</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <FeatureCard
              variants={item}
              icon={<BrainCircuit size={32} className="text-primary" />}
              title="AI Matchmaking"
              description="Our algorithms analyze skills and project goals to find your perfect teammates."
              href="/signup"
            />
            <FeatureCard
              variants={item}
              icon={<Cpu size={32} className="text-teal-400" />}
              title="Team Analysis"
              description="See skill gaps in your team and get suggestions for members you still need."
              href="/signup"
            />
            <FeatureCard
              variants={item}
              icon={<Globe size={32} className="text-indigo-400" />}
              title="Mentor Support"
              description="Connect with industry experts who can help you overcome technical blockers."
              href="/signup"
            />
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 relative overflow-hidden glass border-t border-white/5">
        <div className="container mx-auto px-6">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-12">Orchestrating talent for world-class events</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-20 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0">
            {["Silicon Valley Hacks", "Global AI Summit", "ETH India", "TechCrunch Disrupt", "MIT GrandHack"].map(name => (
              <span key={name} className="text-xl md:text-2xl font-black text-white italic tracking-tighter">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">© 2025 HackNect. All rights reserved.</p>
          <div className="flex items-center space-x-8 text-[10px] font-black uppercase tracking-widest text-white/40">
            <Link href="#" className="hover:text-primary transition-colors">Security</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-2xl md:text-3xl font-black text-white mb-1">{value}</p>
      <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description, variants, href }: { icon: React.ReactNode, title: string, description: string, variants: any, href?: string }) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -10, scale: 1.02 }}
      className="p-10 rounded-[2.5rem] glass-card relative group flex flex-col items-start text-left"
    >
      <div className="p-4 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 transition-all duration-500 group-hover:bg-primary/20 group-hover:border-primary/30">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-white mb-4 tracking-tighter italic uppercase">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed font-medium">{description}</p>

      {href ? (
        <Link href={href} className="mt-8 flex items-center text-primary text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Learn More <ArrowRight size={12} className="ml-2" />
        </Link>
      ) : (
        <div className="mt-8 flex items-center text-primary text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Learn More <ArrowRight size={12} className="ml-2" />
        </div>
      )}
    </motion.div>
  );
}
