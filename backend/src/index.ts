import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import teamRoutes from './routes/team.routes';
import requestRoutes from './routes/request.routes';
import startupRoutes from './routes/startup.routes';
import eventRoutes from './routes/event.routes';
import authRoutes from './routes/auth.routes';
import { initDb } from './config/initDb';
import { checkConnection } from './config/database';

dotenv.config();

// Initialize Database
const setupDb = async () => {
    await checkConnection();
    await initDb();
};
setupDb();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/teams', teamRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('HackNect API is running');
});

// 404 Handler - MUST be after all other routes
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;
