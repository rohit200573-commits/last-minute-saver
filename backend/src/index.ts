import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import gamificationRoutes from './routes/gamificationRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  console.log(`Authorization: ${req.headers.authorization ? 'PRESENT' : 'MISSING'}`);
  next();
});

// Routes
// We pass requireAuth() to routes that need to be protected
app.use('/api/users', requireAuth(), userRoutes);
app.use('/api/tasks', requireAuth(), taskRoutes);
app.use('/api/gamification', requireAuth(), gamificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
