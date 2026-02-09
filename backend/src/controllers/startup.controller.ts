import { Request, Response } from 'express';
import pool from '../config/database';

export class StartupController {
    async getTalentFeed(req: Request, res: Response) {
        try {
            // In a real app, only prime users can access this
            const userId = (req as any).user.id;

            const result = await pool.query(
                `SELECT * FROM v_users_with_profile 
         WHERE user_type = 'participant' AND is_available = TRUE
         LIMIT 20`
            );

            return res.json({ talent: result.rows });
        } catch (error) {
            console.error('Error fetching talent feed:', error);
            return res.status(500).json({ error: 'Failed to fetch talent' });
        }
    }

    async getPrimeTeams(req: Request, res: Response) {
        try {
            const result = await pool.query(
                `SELECT * FROM v_teams_full 
         WHERE status = 'active' OR status = 'forming'
         ORDER BY actual_member_count DESC
         LIMIT 20`
            );

            return res.json({ teams: result.rows });
        } catch (error) {
            console.error('Error fetching prime teams:', error);
            return res.status(500).json({ error: 'Failed to fetch teams' });
        }
    }

    async createJobPosting(req: Request, res: Response) {
        try {
            const { title, description, requiredSkills, jobType, location, isRemote, salaryRange } = req.body;
            const userId = (req as any).user.id;

            // Get startup id for this user
            const startupResult = await pool.query('SELECT id FROM startups WHERE user_id = $1', [userId]);
            if (startupResult.rows.length === 0) {
                return res.status(403).json({ error: 'Startup profile not found' });
            }
            const startupId = startupResult.rows[0].id;

            const result = await pool.query(
                `INSERT INTO job_postings (startup_id, title, description, required_skills, job_type, location, is_remote, salary_range)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
                [startupId, title, description, requiredSkills, jobType, location, isRemote, salaryRange]
            );

            return res.status(201).json({ job: result.rows[0] });
        } catch (error) {
            console.error('Error creating job posting:', error);
            return res.status(500).json({ error: 'Failed to create job posting' });
        }
    }
}
