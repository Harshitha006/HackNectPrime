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
            toast.error("Process failed. Please try again.");
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
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#050505]">
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
                            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-white">Notifications</h3>
                                    <p className="text-xs text-white/50">Recent Activity</p>
                                </div>
                                <div className="px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
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
                                    className="text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors"
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
            className="p-4 rounded-xl border transition-all bg-white/5 border-white/5 hover:border-white/10 group relative overflow-hidden"
        >
            <div className="flex items-start space-x-3">
                <div className="shrink-0 p-2 rounded-lg border text-primary bg-primary/10 border-primary/20 grid place-items-center w-8 h-8">
                    <UserPlus size={14} />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">Join Request</p>
                        <span className="text-[10px] text-white/40">{timeAgo}</span>
                    </div>
                    <p className="text-[10px] font-medium text-primary/80 uppercase tracking-wide">Role: {request.roleApplyingFor}</p>
                    <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{request.message}</p>

                    <div className="flex items-center space-x-2 pt-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onAccept(); }}
                            className="flex-1 py-1.5 rounded-lg bg-primary text-[10px] font-bold text-white hover:bg-primary/90 transition-all flex items-center justify-center space-x-1"
                        >
                            <Check size={12} /> <span>Accept</span>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDeny(); }}
                            className="flex-1 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:bg-white/10 transition-all flex items-center justify-center space-x-1"
                        >
                            <X size={12} /> <span>Deny</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
    );
}
