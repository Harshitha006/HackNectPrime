"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    doc,
    getDoc,
    getDocs,
    deleteDoc,
    serverTimestamp,
    orderBy,
    limit,
    QueryDocumentSnapshot,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { Team, JoinRequest, Hackathon, UserProfile, Match } from "@/types/firebase";

// Hook for real-time Teams
export function useTeams(hackathonId?: string) {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let q = query(collection(db, "teams"), orderBy("createdAt", "desc"));
        if (hackathonId) {
            q = query(q, where("hackathonId", "==", hackathonId));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const teamList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Team[];
            setTeams(teamList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [hackathonId]);

    return { teams, loading };
}

// Hook for real-time Requests
export function useUserRequests(userId: string) {
    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const q = query(
            collection(db, "requests"),
            where("fromUserId", "==", userId),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requestList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as JoinRequest[];
            setRequests(requestList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return { requests, loading };
}

// Hook for received requests (for team admins)
export function useReceivedRequests(userId: string) {
    const [requests, setRequests] = useState<JoinRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        // Note: For better performance, we'd query by team adminId.
        // But JoinRequest currently doesn't store adminId. 
        // We'll fetch teams first or assume NotificationCenter handles the logic.
        // Actually, let's keep it simple: queries for requests where user is involved.

        // This query is tricky because we need requests for TEAMS where user is admin.
        // Firestore doesn't support joins. 
        // Strategy: Just fetch all requests for now and filter client-side, 
        // or add 'toAdminId' to JoinRequest.
        // Let's add 'toAdminId' to JoinRequest schema for easier querying.

        const q = query(
            collection(db, "requests"),
            where("toAdminId", "==", userId),
            orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requestList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as JoinRequest[];
            setRequests(requestList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return { requests, loading };
}

import { calculateMatchScore } from "@/lib/matchmaking";

// Core Functions for Firestore Actions
export const firestoreService = {
    // Create Team
    createTeam: async (teamData: Partial<Team>) => {
        const docRef = await addDoc(collection(db, "teams"), {
            ...teamData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    // Send Join Request
    sendJoinRequest: async (requestData: Partial<JoinRequest>) => {
        const docRef = await addDoc(collection(db, "requests"), {
            ...requestData,
            status: "pending",
            timestamp: serverTimestamp(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    // Accept/Reject Request
    updateRequestStatus: async (requestId: string, status: JoinRequest['status']) => {
        const requestRef = doc(db, "requests", requestId);

        // 1. Get the request data
        const requestSnap = await getDoc(requestRef);
        if (!requestSnap.exists()) throw new Error("Request not found");
        const requestData = requestSnap.data() as JoinRequest;

        // 2. Update request status
        await updateDoc(requestRef, {
            status,
            updatedAt: serverTimestamp(),
        });

        // 3. If accepted, add user to team members
        if (status === 'accepted') {
            const teamRef = doc(db, "teams", requestData.toTeamId);
            await updateDoc(teamRef, {
                currentMembers: arrayUnion(requestData.fromUserId),
                updatedAt: serverTimestamp()
            });
        }
    },

    // Update User Profile
    updateProfile: async (userId: string, profileData: Partial<UserProfile>) => {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            ...profileData,
            updatedAt: serverTimestamp(),
        });
    },

    // Leave Team
    leaveTeam: async (teamId: string, userId: string) => {
        const teamRef = doc(db, "teams", teamId);
        await updateDoc(teamRef, {
            currentMembers: arrayRemove(userId),
            updatedAt: serverTimestamp()
        });
    },

    // Disband Team
    disbandTeam: async (teamId: string) => {
        const teamRef = doc(db, "teams", teamId);
        await deleteDoc(teamRef);
    },

    // Find Matches for a User
    findMatches: async (userId: string) => {
        // 1. Get user profile
        const userDoc = await getDoc(doc(db, "users", userId));
        if (!userDoc.exists()) return [];
        const userData = userDoc.data() as UserProfile;

        // 2. Map user profile to MatchProfile
        // Note: Adjust mapping based on actual UserProfile fields
        const userMatchProfile = {
            id: userData.id,
            skills: userData.skills,
            interests: userData.lookingFor, // or a dedicated interests field
            experienceLevel: userData.experienceLevel === 'expert' ? 5 : userData.experienceLevel === 'intermediate' ? 3 : 1
        };

        // 3. Get all teams
        const teamsSnapshot = await getDocs(collection(db, "teams"));
        const teams = teamsSnapshot.docs.map((d: QueryDocumentSnapshot) => ({ id: d.id, ...d.data() })) as Team[];

        // 4. Calculate scores
        const matches = teams.map(team => {
            const teamMatchProfile = {
                id: team.id,
                skills: team.skillsNeeded,
                interests: [team.projectIdea], // or other relevant fields
                experienceLevel: 3 // default
            };
            const { score, reasons } = calculateMatchScore(userMatchProfile, teamMatchProfile);
            return {
                teamId: team.id,
                score,
                reasons
            };
        });

        // 5. Sort and return
        return matches.sort((a, b) => b.score - a.score);
    },
};
