import { Timestamp } from 'firebase/firestore';

export type UserRole = 'student' | 'mentor' | 'organizer' | 'admin';
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type TeamStatus = 'forming' | 'recruiting' | 'full' | 'completed';

export interface UserProfile {
    id: string;
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    skills: string[];
    bio: string;
    experienceLevel: 'beginner' | 'intermediate' | 'expert';
    location: string;
    lookingFor: string[]; // hackathon ids
    mentorFor?: string[]; // hackathon ids
    avatar?: string;
    createdAt: Timestamp | Date;
    updatedAt: Timestamp | Date;
}

export interface Team {
    id: string;
    name: string;
    hackathonId: string;
    projectIdea: string;
    description: string;
    currentMembers: string[]; // user uids
    rolesNeeded: string[];
    skillsNeeded: string[];
    mentorNeeded: boolean;
    status: TeamStatus;
    communicationLink?: string;
    adminId: string; // the creator of the team
    createdAt: Timestamp | Date;
    updatedAt: Timestamp | Date;
}

export interface Hackathon {
    id: string;
    name: string;
    theme: string;
    level: 'local' | 'national' | 'global' | 'international';
    deadline: Timestamp | Date;
    location: string;
    organizer: string;
    prizes: string[];
    description: string;
    website?: string;
    tags: string[];
    image?: string;
    createdAt: Timestamp | Date;
    updatedAt: Timestamp | Date;
}

export interface JoinRequest {
    id: string;
    fromUserId: string;
    toTeamId: string;
    toAdminId: string; // The admin of the team receiving the request
    message: string;
    status: RequestStatus;
    roleApplyingFor: string;
    timestamp: Timestamp | Date;
    createdAt: Timestamp | Date;
    updatedAt: Timestamp | Date;
}

export interface Match {
    id: string;
    userId: string;
    teamId: string;
    matchScore: number;
    reason: string[];
    status: 'recommended' | 'ignored' | 'accepted';
    timestamp: Timestamp | Date;
    createdAt: Timestamp | Date;
    updatedAt: Timestamp | Date;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: Timestamp | Date;
}
