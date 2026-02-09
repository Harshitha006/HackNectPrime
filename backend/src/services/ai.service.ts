import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export class AIService {
    async getMatches(userProfile: any, teams: any[]) {
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/match/user-to-teams`, {
                user: {
                    id: userProfile.id,
                    skills: userProfile.skills || [],
                    interests: userProfile.interests || [],
                    experience_level: userProfile.experience_level || 'intermediate',
                    bio: userProfile.bio
                },
                teams: teams.map(t => ({
                    id: t.id,
                    name: t.name,
                    description: t.description || '',
                    project_idea: t.projectIdea || '',
                    project_domain: t.project_domain || '',
                    tech_stack: t.techStack || [],
                    open_roles: t.openRoles || []
                }))
            });
            return response.data;
        } catch (error) {
            console.error('AI Service Match Error:', error);
            return [];
        }
    }

    async analyzeSkills(currentSkills: string[], requiredSkills: string[]) {
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/analyze/skills`, {
                current_skills: currentSkills,
                required_skills: requiredSkills
            });
            return response.data;
        } catch (error) {
            console.error('AI Service Skill Analysis Error:', error);
            return null;
        }
    }

    async analyzeRadar(messages: string[]) {
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/analyze/radar`, {
                messages
            });
            return response.data;
        } catch (error) {
            console.error('AI Service Radar Error:', error);
            return null;
        }
    }
}
