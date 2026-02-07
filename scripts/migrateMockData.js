const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// YOU NEED TO DOWNLOAD YOUR SERVICE ACCOUNT KEY FROM FIREBASE CONSOLE
// AND PLACE IT IN THE SCRIPTS FOLDER AS 'serviceAccountKey.json'
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const MOCK_DATA = {
    "users": [
        {
            "id": "user_001",
            "name": "Alex Chen",
            "email": "alex@example.com",
            "role": "student",
            "skills": ["React", "Node.js", "Python", "ML"],
            "bio": "Full-stack developer passionate about AI",
            "experienceLevel": "intermediate",
            "location": "San Francisco",
            "lookingFor": ["hackathon_001"],
            "avatar": "https://example.com/avatar1.jpg"
        },
        {
            "id": "user_002",
            "name": "Maya Patel",
            "email": "maya@example.com",
            "role": "mentor",
            "skills": ["AI/ML", "TensorFlow", "Computer Vision", "React Native"],
            "bio": "AI Research Scientist with 5 years experience",
            "experienceLevel": "expert",
            "location": "Remote",
            "mentorFor": ["hackathon_001", "hackathon_002"],
            "avatar": "https://example.com/avatar2.jpg"
        },
        {
            "id": "user_003",
            "name": "David Kim",
            "email": "david@example.com",
            "role": "student",
            "skills": ["UI/UX Design", "Figma", "Frontend", "Product"],
            "bio": "Designer turned developer, love hackathons",
            "experienceLevel": "beginner",
            "location": "New York",
            "lookingFor": ["hackathon_001"],
            "avatar": "https://example.com/avatar3.jpg"
        }
    ],

    "teams": [
        {
            "id": "team_001",
            "name": "AI Innovators",
            "hackathonId": "hackathon_001",
            "projectIdea": "AI-powered mental health chatbot for students",
            "currentMembers": ["user_001"],
            "rolesNeeded": ["UI/UX Designer", "ML Engineer", "Backend Developer"],
            "skillsNeeded": ["React", "Python", "TensorFlow", "Figma"],
            "mentorNeeded": true,
            "status": "forming",
            "description": "Building an accessible mental health solution using AI",
            "communicationLink": "https://discord.gg/example",
            "createdAt": "2024-02-10T10:30:00Z"
        },
        {
            "id": "team_002",
            "name": "EcoTech Warriors",
            "hackathonId": "hackathon_001",
            "projectIdea": "Blockchain-based carbon credit tracking",
            "currentMembers": [],
            "rolesNeeded": ["Blockchain Dev", "Full-stack", "Business"],
            "skillsNeeded": ["Solidity", "React", "Node.js", "Smart Contracts"],
            "mentorNeeded": false,
            "status": "recruiting",
            "description": "Making carbon credits transparent and accessible",
            "createdAt": "2024-02-09T14:20:00Z"
        }
    ],

    "hackathons": [
        {
            "id": "hackathon_001",
            "name": "Global AI Hackathon 2024",
            "theme": "AI for Social Good",
            "level": "global",
            "deadline": "2024-03-15T23:59:59Z",
            "location": "Virtual",
            "organizer": "TechForGood Inc.",
            "prizes": ["$10,000", "Mentorship", "VC Meetings"],
            "description": "Build AI solutions addressing social challenges",
            "website": "https://globalaihack.devpost.com",
            "tags": ["AI", "Social Impact", "Machine Learning"]
        },
        {
            "id": "hackathon_002",
            "name": "Climate Tech Challenge",
            "theme": "Sustainable Solutions",
            "level": "national",
            "deadline": "2024-04-10T23:59:59Z",
            "location": "San Francisco + Virtual",
            "organizer": "GreenTech Foundation",
            "prizes": ["$15,000", "Incubation", "Industry Partnerships"],
            "description": "Innovate for a sustainable future",
            "website": "https://climatetech.dev",
            "tags": ["Sustainability", "Clean Tech", "Environment"]
        }
    ],

    "requests": [
        {
            "id": "req_001",
            "fromUserId": "user_003",
            "toTeamId": "team_001",
            "message": "Hi! I'm a UI/UX designer with Figma expertise, would love to contribute to your mental health project.",
            "status": "pending",
            "timestamp": "2024-02-10T11:45:00Z",
            "roleApplyingFor": "UI/UX Designer"
        },
        {
            "id": "req_002",
            "fromUserId": "user_002",
            "toTeamId": "team_001",
            "message": "I can mentor your team on the AI/ML aspects. I have experience with similar projects.",
            "status": "pending",
            "timestamp": "2024-02-10T12:30:00Z",
            "roleApplyingFor": "Mentor"
        }
    ],

    "matches": [
        {
            "id": "match_001",
            "userId": "user_003",
            "teamId": "team_001",
            "matchScore": 0.92,
            "reason": ["Skills alignment: UI/UX Design (100%), React (85%)"],
            "timestamp": "2024-02-10T10:35:00Z",
            "status": "recommended"
        }
    ]
};

async function migrate() {
    const batch = db.batch();

    // Migrate Users
    MOCK_DATA.users.forEach(user => {
        const userRef = db.collection('users').doc(user.id);
        batch.set(userRef, {
            ...user,
            uid: user.id, // For auth mapping
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    });

    // Migrate Hackathons
    MOCK_DATA.hackathons.forEach(hack => {
        const ref = db.collection('hackathons').doc(hack.id);
        batch.set(ref, {
            ...hack,
            deadline: admin.firestore.Timestamp.fromDate(new Date(hack.deadline)),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    });

    // Migrate Teams
    MOCK_DATA.teams.forEach(team => {
        const ref = db.collection('teams').doc(team.id);
        batch.set(ref, {
            ...team,
            adminId: team.currentMembers[0] || 'unknown',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    });

    // Migrate Requests
    MOCK_DATA.requests.forEach(req => {
        const ref = db.collection('requests').doc(req.id);
        batch.set(ref, {
            ...req,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    });

    await batch.commit();
    console.log('Migration completed successfully!');
}

migrate().catch(console.error);
