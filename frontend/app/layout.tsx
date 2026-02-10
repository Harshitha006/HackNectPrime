import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for clear readability
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "HackNect - AI-Powered Matchmaking",
    description: "Find your perfect hackathon team using AI.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} min-h-screen flex flex-col`}
            >
                <AuthProvider>
                    <Navbar />
                    <main className="flex-grow container mx-auto px-4 py-8">
                        {children}
                    </main>
                </AuthProvider>
                <footer className="bg-gray-800 text-white py-8 mt-auto">
                    <div className="container mx-auto px-4 text-center">
                        <p>&copy; {new Date().getFullYear()} HackNect. All rights reserved.</p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
