import pool from '../config/database';

export interface Team {
    id: string;
    name: string;
    description?: string;
    projectIdea?: string;
    leaderId: string;
    maxMembers: number;
    currentMembers: number;
    status: 'forming' | 'active' | 'completed' | 'disbanded';
    lookingForMembers: boolean;
    openRoles?: any[];
    techStack?: string[];
}

export class TeamService {
    async create(teamData: any): Promise<Team> {
        const {
            name, description, projectIdea, eventId, leaderId,
            maxMembers = 5, techStack = [], projectDomain
        } = teamData;

        const result = await pool.query(
            `INSERT INTO teams (
        name, description, project_idea, event_id, leader_id, 
        max_members, tech_stack, project_domain
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
            [name, description, projectIdea, eventId, leaderId, maxMembers, techStack, projectDomain]
        );

        return this.mapToTeam(result.rows[0]);
    }

    async addMember(teamId: string, userId: string, role: string, isLeader: boolean = false) {
        await pool.query(
            `INSERT INTO team_members (team_id, user_id, role, is_leader) 
       VALUES ($1, $2, $3, $4)`,
            [teamId, userId, role, isLeader]
        );
    }

    async getOpenTeams(options: { limit: number; offset: number }): Promise<Team[]> {
        const { limit, offset } = options;

        // Using the view created in SQL schema
        const result = await pool.query(
            `SELECT * FROM v_open_teams 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        return result.rows.map(row => this.mapToTeam(row));
    }

    async getUserProfile(userId: string) {
        const result = await pool.query(
            `SELECT * FROM v_users_with_profile WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0];
    }

    private mapToTeam(row: any): Team {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            projectIdea: row.project_idea,
            leaderId: row.leader_id,
            maxMembers: row.max_members,
            currentMembers: row.current_members,
            status: row.status,
            lookingForMembers: row.looking_for_members,
            openRoles: row.needed_roles ? row.needed_roles.map((title: string, index: number) => ({
                roleTitle: title,
                requiredSkills: row.all_required_skills ? [row.all_required_skills[index]] : [] // Simplified mapping
            })) : [],
            techStack: row.tech_stack
        };
    }
}
