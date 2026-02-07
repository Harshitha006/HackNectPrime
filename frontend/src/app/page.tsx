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
    <div className="flex flex-col min-h-screen bg-[#08080a] selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Rocket className="text-white fill-white/20" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Hack<span className="text-primary">Nect</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-white/70">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#missions" className="hover:text-white transition-colors">Stats</Link>
            <Link href="/events" className="hover:text-white transition-colors">Events</Link>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <Link href="/login" className="hover:text-white transition-all">Login</Link>
            <Link href="/signup" className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition-all">Get Started</Link>
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
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-8">
                <Stars size={14} className="fill-primary" />
                <span>AI Matching is Live</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                Build your <br />
                <span className="text-gradient">dream team</span>
              </h1>
              <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
                The AI-powered platform for hackathons. Connect with developers, designers, and innovators and build something amazing together.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="/onboarding"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all flex items-center justify-center group"
                >
                  Join HackNect
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/events"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl glass hover:bg-white/5 text-white font-bold text-sm transition-all flex items-center justify-center"
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Platform Features</h2>
            <p className="text-white/60 max-w-xl mx-auto text-sm leading-relaxed">Built to help you find the perfect team and win your next hackathon.</p>
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
          <p className="text-center text-xs font-bold uppercase tracking-widest text-white/20 mb-12">Trusted by world-class events</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0">
            {["Silicon Valley Hacks", "Global AI Summit", "ETH India", "TechCrunch Disrupt", "MIT GrandHack"].map(name => (
              <span key={name} className="text-lg md:text-xl font-bold text-white tracking-tight">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-medium text-white/20">© 2025 HackNect. All rights reserved.</p>
          <div className="flex items-center space-x-8 text-xs font-medium text-white/40">
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight">{value}</p>
      <p className="text-xs font-medium text-white/40 uppercase tracking-wide">{label}</p>
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
      <div className="p-3 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>

      {href ? (
        <Link href={href} className="mt-8 flex items-center text-primary text-xs font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
          Learn More <ArrowRight size={14} className="ml-2" />
        </Link>
      ) : (
        <div className="mt-8 flex items-center text-primary text-xs font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
          Learn More <ArrowRight size={14} className="ml-2" />
        </div>
      )}
    </motion.div>
  );
}
