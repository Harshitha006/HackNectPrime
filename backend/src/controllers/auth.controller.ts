import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool, { getIsDemoMode, query } from '../config/database';

let demoOnboarded = false;

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password, userType } = req.body;

            if (getIsDemoMode()) {
                const mockUser = { id: 'demo-user-id', name: name || 'Demo User', email, user_type: userType || 'participant' };
                const token = jwt.sign(
                    { id: mockUser.id, email: mockUser.email, role: mockUser.user_type },
                    process.env.JWT_SECRET || 'secret',
                    { expiresIn: '24h' }
                );
                return res.status(201).json({ user: mockUser, token });
            }

            // Check if user exists
            const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'User already exists with this email' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            const result = await query(
                'INSERT INTO users (name, email, password, user_type, is_onboarded) VALUES ($1, $2, $3, $4, FALSE) RETURNING id, name, email, user_type, is_onboarded',
                [name, email, hashedPassword, userType || 'participant']
            );

            const user = result.rows[0];

            // Generate token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.user_type },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '24h' }
            );

            return res.status(201).json({ user, token });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ error: 'Failed to register' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (getIsDemoMode()) {
                let userType = 'participant';
                if (email.toLowerCase().includes('startup')) userType = 'startup';
                if (email.toLowerCase().includes('mentor')) userType = 'mentor';

                const mockUser = { id: 'demo-user-id', name: 'Demo User', email, user_type: userType };
                const token = jwt.sign(
                    { id: mockUser.id, email: mockUser.email, role: mockUser.user_type },
                    process.env.JWT_SECRET || 'secret',
                    { expiresIn: '24h' }
                );
                return res.json({ user: mockUser, token });
            }

            // Find user
            const result = await query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = result.rows[0];

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.user_type },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '24h' }
            );

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            return res.json({ user: userWithoutPassword, token });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Failed to login' });
        }
    }

    async googleAuth(req: Request, res: Response) {
        try {
            const { googleId, email, name, photoUrl } = req.body;

            // Check if user exists by googleId or email
            let result = await query('SELECT * FROM users WHERE email = $1', [email]);

            let user;
            if (result.rows.length === 0) {
                // Create new user
                result = await query(
                    'INSERT INTO users (name, email, google_id, photo_url, user_type, is_onboarded) VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING id, name, email, user_type, is_onboarded',
                    [name, email, googleId, photoUrl, 'participant']
                );
                user = result.rows[0];
            } else {
                user = result.rows[0];
                // Update googleId if not present
                if (!user.google_id) {
                    await query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
                }
            }

            // Generate token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.user_type },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '24h' }
            );

            return res.json({ user, token });
        } catch (error) {
            console.error('Google auth error:', error);
            return res.status(500).json({ error: 'Failed to authenticate with Google' });
        }
    }

    async me(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;

            if (getIsDemoMode()) {
                const decodedUser = (req as any).user;
                return res.json({
                    user: {
                        id: userId,
                        name: 'Demo User',
                        email: decodedUser?.email || 'demo@example.com',
                        user_type: decodedUser?.role || 'participant',
                        is_onboarded: demoOnboarded
                    }
                });
            }

            const result = await query('SELECT id, name, email, user_type, photo_url, is_onboarded FROM users WHERE id = $1', [userId]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.json({ user: result.rows[0] });
        } catch (error) {
            console.error('Me error:', error);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }
    }

    async completeOnboarding(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { name, bio, skills, major, expertise, availability, company, industry } = req.body;

            if (getIsDemoMode()) {
                demoOnboarded = true;
                return res.json({ success: true });
            }

            await query(
                `UPDATE users SET 
                    name = COALESCE($1, name),
                    bio = $2, 
                    skills = $3, 
                    major = $4, 
                    expertise = $5, 
                    availability = $6, 
                    company = $7, 
                    industry = $8,
                    is_onboarded = TRUE 
                WHERE id = $9`,
                [name, bio, skills, major, expertise, availability, company, industry, userId]
            );
            return res.json({ success: true });
        } catch (error) {
            console.error('Onboarding update error:', error);
            return res.status(500).json({ error: 'Failed to update onboarding status' });
        }
    }
}
