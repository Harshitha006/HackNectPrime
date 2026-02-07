"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    UserPlus,
    MessageSquare,
    Star,
    X,
    Check,
    AlertCircle,
    Zap,
    Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
    id: string;
    type: 'request' | 'match' | 'announcement' | 'alert' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
    sender?: {
        name: string;
        avatar: string;
    };
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        type: "request",
        title: "Join Request",
        message: "Alex Hunter requested to join 'Team Innovate' as ML Engineer.",
        time: "10m ago",
        read: false,
        sender: { name: "Alex Hunter", avatar: "A" }
    },
    {
        id: "2",
        type: "match",
        title: "AI Match Found!",
        message: "You have a 92% compatibility match with 'CyberGuard' team.",
        time: "1h ago",
        read: false
    },
    {
        id: "3",
        type: "announcement",
        title: "Startup Opportunity",
        message: "FutureVentures posted a new 'AI Intern' role for Prime users.",
        time: "2h ago",
        read: true
    }
];

import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useReceivedRequests, firestoreService } from "@/hooks/useFirestore";
import { JoinRequest } from "@/types/firebase";

export function NotificationCenter() {
    const { user } = useAuth();
    const { requests: receivedRequests, loading: requestsLoading } = useReceivedRequests(user?.uid || "");
    const [isOpen, setIsOpen] = useState(false);

    const pendingRequests = receivedRequests.filter(r => r.status === 'pending');
    const unreadCount = pendingRequests.length;

    const handleAction = async (requestId: string, status: 'accepted' | 'rejected') => {
        try {
            await firestoreService.updateRequestStatus(requestId, status);
            toast.success(`Request ${status === 'accepted' ? 'accepted' : 'denied'}`);
        } catch (error) {
            toast.error("Process failed. Neural link unstable.");
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all relative group"
            >
                <Bell size={20} className={cn(unreadCount > 0 && "animate-bell")} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[8px] font-black text-white flex items-center justify-center border-2 border-[#050505]">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-96 max-h-[600px] overflow-hidden bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[101] flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Notifications</h3>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Recent Activity</p>
                                </div>
                                <div className="p-1 px-3 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase">
                                    {unreadCount} New
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {pendingRequests.length > 0 ? (
                                    pendingRequests.map((request) => (
                                        <NotificationItem
                                            key={request.id}
                                            request={request}
                                            onAccept={() => handleAction(request.id, 'accepted')}
                                            onDeny={() => handleAction(request.id, 'rejected')}
                                        />
                                    ))
                                ) : (
                                    <div className="py-12 text-center space-y-4">
                                        <Zap size={32} className="text-white/10 mx-auto" />
                                        <p className="text-xs font-bold text-white/20 uppercase tracking-widest">No pending requests</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center">
                                <button
                                    onClick={() => toast.info("History Log", { description: "Verified request history." })}
                                    className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-white transition-colors"
                                >
                                    View History
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function NotificationItem({ request, onAccept, onDeny }: { request: JoinRequest, onAccept: () => void, onDeny: () => void }) {
    const timeAgo = request.timestamp ? "Recent" : "Just now"; // Simplification for now

    return (
        <div
            className="p-5 rounded-[1.5rem] border transition-all bg-white/5 border-white/10 hover:border-primary/30 group relative overflow-hidden"
        >
            <div className="flex items-start space-x-4">
                <div className="shrink-0 p-2.5 rounded-xl border text-primary bg-primary/10 border-primary/20">
                    <UserPlus size={14} />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black uppercase tracking-tight text-white/80 group-hover:text-primary transition-colors">Join Request</p>
                        <span className="text-[9px] font-bold text-white/20">{timeAgo}</span>
                    </div>
                    <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Role: {request.roleApplyingFor}</p>
                    <p className="text-xs text-white/40 leading-relaxed font-medium line-clamp-2">{request.message}</p>

                    <div className="flex items-center space-x-2 pt-3">
                        <button
                            onClick={(e) => { e.stopPropagation(); onAccept(); }}
                            className="flex-1 py-1.5 rounded-lg bg-primary text-[9px] font-black uppercase tracking-widest text-white hover:bg-primary/90 transition-all flex items-center justify-center space-x-2"
                        >
                            <Check size={10} /> <span>Accept</span>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDeny(); }}
                            className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                        >
                            <X size={10} /> <span>Deny</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/50" />
        </div>
    );
}
