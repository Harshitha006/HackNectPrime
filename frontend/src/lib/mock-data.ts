export const MOCK_HACKATHONS = [
    {
        id: "h1",
        name: "Global AI Vision 2025",
        type: "Global",
        date: "Feb 20-22, 2025",
        location: "Online",
        prize: "$50,000",
        theme: "AI/ML",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: "h2",
        name: "National CodeFest 2025",
        type: "National",
        date: "March 15-16, 2025",
        location: "Bangalore, IN",
        prize: "₹10,00,000",
        theme: "Fullstack",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400",
    },
    {
        id: "h3",
        name: "Web3 World Summit",
        type: "International",
        date: "April 5-7, 2025",
        location: "Dubai, UAE",
        prize: "50 ETH",
        theme: "Blockchain",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=400",
    },
];

export const MOCK_TEAMS = [
    {
        id: "t1",
        name: "Team Innovate",
        description: "Building an AI-powered medical diagnosis app using LLMs.",
        members: [
            { name: "John Doe", role: "Leader", avatar: "JD" },
            { name: "Sarah Smith", role: "Frontend", avatar: "SS" },
        ],
        rolesNeeded: ["Data Scientist", "UI/UX Designer"],
        matchScore: 0.92,
        matchReasons: ["Matches your Data Science skill", "Aligned with your HealthTech interest"],
        techStack: ["React", "Python", "FastAPI"],
    },
    {
        id: "t2",
        name: "CyberGuardians",
        description: "Developing a zero-trust network monitoring tool for enterprises.",
        members: [
            { name: "Mike Ross", role: "Leader", avatar: "MR" },
        ],
        rolesNeeded: ["Security Engineer", "Backend Dev"],
        matchScore: 0.78,
        matchReasons: ["Matches your Python proficiency", "High experience compatibility"],
        techStack: ["Go", "Kubernetes", "Docker"],
    },
    {
        id: "t3",
        name: "DeFi Wizards",
        description: "Creating a cross-chain liquidity aggregator for stablecoins.",
        members: [
            { name: "Alice Wang", role: "Leader", avatar: "AW" },
            { name: "Bob Lee", role: "Smart Contracts", avatar: "BL" },
        ],
        rolesNeeded: ["React Developer"],
        matchScore: 0.85,
        matchReasons: ["Matches your React.js expertise", "Shared interest in Web3"],
        techStack: ["Next.js", "Solidity", "Ethers.js"],
    },
];

export const MOCK_USER = {
    name: "Harshitha",
    major: "Computer Science",
    skills: ["React", "Python", "Data Science", "Machine Learning"],
    interests: ["AI/ML", "HealthTech", "Web3"],
    avatar: "H",
};
