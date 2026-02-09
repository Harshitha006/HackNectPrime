import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // const token = req.headers.authorization?.split(' ')[1];

    // if (!token) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    // try {
    //   const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    //   req.user = payload;
    //   next();
    // } catch (error) {
    //   return res.status(403).json({ error: 'Forbidden' });
    // }

    // NOTE: Stubbing out auth for now to allow progress on other components
    // In a real app, strict validation would apply.

    (req as any).user = { id: 'test-user-id', role: 'student' };
    next();
};
