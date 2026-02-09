import { Request, Response } from 'express';
import pool from '../config/database';

export class EventController {
    async getEvents(req: Request, res: Response) {
        try {
            const { type, search } = req.query;
            let queryStr = 'SELECT * FROM v_active_events';
            const params: any[] = [];

            if (type && type !== 'All') {
                queryStr += ' WHERE event_type = $1';
                params.push(type.toString().toLowerCase());
            }

            const result = await pool.query(queryStr, params);
            return res.json({ events: result.rows });
        } catch (error) {
            console.error('Error fetching events:', error);
            return res.status(500).json({ error: 'Failed to fetch events' });
        }
    }

    async registerForEvent(req: Request, res: Response) {
        try {
            const { eventId, optIn } = req.body;
            const userId = (req as any).user.id;

            const result = await pool.query(
                `INSERT INTO event_registrations (event_id, user_id, opt_in_notifications)
         VALUES ($1, $2, $3)
         ON CONFLICT (event_id, user_id) DO UPDATE 
         SET opt_in_notifications = $3
         RETURNING *`,
                [eventId, userId, optIn ?? true]
            );

            return res.status(200).json({
                message: 'Registered successfully',
                registration: result.rows[0]
            });
        } catch (error) {
            console.error('Error registering for event:', error);
            return res.status(500).json({ error: 'Failed to register' });
        }
    }
}
