import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getIsDemoMode } from '../config/database';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        if (getIsDemoMode()) {
            console.warn('No token provided. Using Demo User fallback.');
            (req as any).user = { id: 'demo-user-id', role: 'participant' };
            return next();
        }
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        (req as any).user = payload;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(403).json({ error: 'Forbidden' });
    }
};
