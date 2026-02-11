import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let isDemoMode = false;

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'hacknect',
    password: process.env.DB_PASSWORD || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
});

// Test connection and set demo mode if it fails
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export const checkConnection = async () => {
    try {
        const client = await pool.connect();
        client.release();
        return true;
    } catch (err) {
        console.error('Database connection failed. Switching to DEMO MODE (In-memory).');
        isDemoMode = true;
        return false;
    }
};

export const getIsDemoMode = () => isDemoMode;

export const query = (text: string, params?: any[]) => {
    if (isDemoMode) {
        console.warn('Query skipped (Demo Mode):', text);

        // Return mock data based on query content
        if (text.includes('v_users_with_profile')) {
            return {
                rows: [{
                    id: params ? params[0] : 'demo-user-id',
                    name: 'Demo User',
                    skills: ['React', 'TypeScript', 'Node.js'],
                    interests: ['AI', 'Sustainability'],
                    bio: 'Interested in building impactful tech solutions.'
                }]
            } as any;
        }

        if (text.includes('v_open_teams')) {
            return {
                rows: [
                    {
                        id: '1',
                        name: 'NeuroLink',
                        description: 'Brain-computer interface for gaming.',
                        project_id: '1',
                        project_idea: 'Use EEG to control movement.',
                        leader_id: 'leader-1',
                        max_members: 5,
                        current_members: 2,
                        status: 'forming',
                        looking_for_members: true,
                        needed_roles: ['Frontend Developer', 'Data Scientist'],
                        all_required_skills: ['React', 'Python'],
                        tech_stack: ['TypeScript', 'Python', 'TensorFlow']
                    },
                    {
                        id: '2',
                        name: 'EcoSmart',
                        description: 'AI-driven waste management.',
                        project_id: '2',
                        project_idea: 'Smart bins that sort trash.',
                        leader_id: 'leader-2',
                        max_members: 4,
                        current_members: 1,
                        status: 'forming',
                        looking_for_members: true,
                        needed_roles: ['Backend Developer'],
                        all_required_skills: ['Node.js'],
                        tech_stack: ['JavaScript', 'PostgreSQL']
                    }
                ]
            } as any;
        }

        if (text.includes('v_active_events')) {
            return {
                rows: [
                    {
                        id: '1',
                        name: 'Codefest 2025',
                        theme: 'Innovation in Technology',
                        date: 'March 15-17, 2025',
                        location: 'Mumbai, India',
                        deadline: 'March 10, 2025',
                        type: 'National',
                        description: 'India\'s largest student coding championship.',
                        tags: ['Web', 'Mobile', 'Innovate']
                    },
                    {
                        id: '2',
                        name: 'AI/ML Global Hackathon',
                        theme: 'AI for Social Good',
                        date: 'April 01-03, 2025',
                        location: 'Virtual',
                        deadline: 'March 25, 2025',
                        type: 'Global',
                        description: 'Build AI solutions that matter.',
                        tags: ['AI', 'ML', 'Python']
                    }
                ]
            } as any;
        }

        return { rows: [] } as any;
    }
    return pool.query(text, params);
};

export default pool;