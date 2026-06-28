import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import gamificationRoutes from './routes/gamificationRoutes';
import chatRoutes from './routes/chatRoutes';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://your-production-url.vercel.app'] 
  : ['http://localhost:3000', 'http://localhost:3002'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);
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
app.use('/api/chat', requireAuth(), chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
