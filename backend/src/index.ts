import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import teamRoutes from './routes/team.routes';
import requestRoutes from './routes/request.routes';
import startupRoutes from './routes/startup.routes';
import eventRoutes from './routes/event.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/teams', teamRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/events', eventRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('HackNect API is running');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;
