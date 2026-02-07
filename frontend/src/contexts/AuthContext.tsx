"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { UserProfile } from "@/types/firebase";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch user profile from Firestore
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                if (userDoc.exists()) {
                    setProfile(userDoc.data() as UserProfile);
                } else {
                    // If no profile exists, create a basic one
                    const newProfile: Partial<UserProfile> = {
                        id: firebaseUser.uid,
                        uid: firebaseUser.uid,
                        name: firebaseUser.displayName || "",
                        email: firebaseUser.email || "",
                        role: "student",
                        skills: [],
                        bio: "",
                        experienceLevel: "beginner",
                        location: "",
                        lookingFor: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    await setDoc(doc(db, "users", firebaseUser.uid), newProfile);
                    setProfile(newProfile as UserProfile);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
