import { Request, Response } from 'express';
import { query } from '../config/database';

export class RequestController {
    async createRequest(req: Request, res: Response) {
        try {
            const { teamId, message, pitch, requestType } = req.body;
            const userId = (req as any).user.id;

            const result = await query(
                `INSERT INTO join_requests (user_id, team_id, request_type, message, pitch)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
                [userId, teamId, requestType || 'user_to_team', message, pitch]
            );

            // In a real app, you would emit a socket.io event here for real-time notification
            // io.to(teamId).emit('notification', { type: 'NEW_REQUEST', data: result.rows[0] });

            return res.status(201).json({
                message: 'Request sent successfully',
                request: result.rows[0]
            });
        } catch (error) {
            console.error('Error creating request:', error);
            return res.status(500).json({ error: 'Failed to send request' });
        }
    }

    async getMyNotifications(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;

            // Get requests sent to the user OR teams the user leads
            const result = await query(
                `SELECT jr.*, u.display_name as sender_name, t.name as team_name
         FROM join_requests jr
         LEFT JOIN users u ON jr.user_id = u.id
         LEFT JOIN teams t ON jr.team_id = t.id
         WHERE (jr.user_id = $1 AND jr.request_type = 'team_to_user')
            OR (t.leader_id = $1 AND jr.request_type = 'user_to_team')
         ORDER BY jr.requested_at DESC`,
                [userId]
            );

            return res.json({ notifications: result.rows });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    }
}
