import { Request, Response } from 'express';
import { TeamService } from '../services/team.service';
import { AIService } from '../services/ai.service';

export class TeamController {
    private teamService: TeamService;
    private aiService: AIService;

    constructor() {
        this.teamService = new TeamService();
        this.aiService = new AIService();
    }

    async createTeam(req: Request, res: Response) {
        try {
            // In a real app, req.user would be populated by auth middleware
            const userId = (req as any).user?.id || 'temp-user-id';
            const teamData = req.body;

            // Validate input (simplified)
            if (!teamData.name || !teamData.projectIdea) {
                return res.status(400).json({ error: 'Name and Project Idea are required' });
            }

            // Create team
            const team = await this.teamService.create({
                ...teamData,
                leaderId: userId,
                currentMembers: 1
            });

            // Add leader as first member
            await this.teamService.addMember(team.id, userId, 'Team Leader', true);

            // Create notification for event participants (placeholder)
            // await this.notifyEventParticipants(team);

            return res.status(201).json({ team });
        } catch (error) {
            console.error('Error creating team:', error);
            return res.status(500).json({
                error: 'Failed to create team',
                details: error instanceof Error ? error.message : String(error)
            });
        }
    }

    async getTeamFeed(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id || 'temp-user-id';
            const { limit = 20, offset = 0 } = req.query;

            // Get user's skills and interests
            const userProfile = await this.teamService.getUserProfile(userId);

            // Get teams with open roles
            const teams = await this.teamService.getOpenTeams({
                limit: Number(limit),
                offset: Number(offset)
            });

            // Use AI Service for matching
            const aiMatches = await this.aiService.getMatches(userProfile, teams);

            // Merge AI scores with team data
            const enrichedTeams = teams.map(team => {
                const aiMatch = aiMatches.find((m: any) => m.team_id === team.id);
                const matchingRoles = (team.openRoles || []).filter((role: any) =>
                    role.requiredSkills.some((skill: string) =>
                        userProfile.skills.includes(skill)
                    )
                );

                return {
                    ...team,
                    matchingRoles,
                    isMatch: (aiMatch?.compatibility_score || 0) > 0.6 || matchingRoles.length > 0,
                    aiScore: aiMatch?.compatibility_score || 0,
                    matchReasons: aiMatch?.match_reasons || {}
                };
            });

            // Sort by AI score first, then matching roles count
            enrichedTeams.sort((a, b) => {
                if (b.aiScore !== a.aiScore) return b.aiScore - a.aiScore;
                return (b.matchingRoles.length - a.matchingRoles.length);
            });

            return res.json({ teams: enrichedTeams });
        } catch (error) {
            console.error('Error getting team feed:', error);
            return res.status(500).json({ error: 'Failed to get teams' });
        }
    }
}
