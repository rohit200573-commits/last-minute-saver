# Last Minute Life Saver 🌌

> **The future of productivity is here.**
> A full-stack AI platform that mathematically prevents procrastination and eliminates missed deadlines through Predictive Digital Twins.

## 🧠 The Unique IP: Predictive Digital Twin
Most productivity apps act as passive storage for your tasks. **Last Minute Life Saver** acts as an active, predictive engine.

The core Intellectual Property lies in our **Predictive Digital Twin Engine**:
1. **Historical Analysis**: The system analyzes your past completion rates, the time of day you work best, and the types of tasks you typically procrastinate on.
2. **Procrastination Probability Matrix (PPM)**: For every new task entered, the AI calculates a mathematical probability of failure based on the deadline and your historical behavior.
3. **Emergency Rescue Mode**: When a task's failure probability exceeds a critical threshold (e.g., < 24 hours remaining with high historical procrastination), the system automatically locks out low-priority tasks, triggers an aggressive AI breakdown of the task into 15-minute micro-steps, and enforces a "Focus Session" environment.

## 🚀 Key Features
- **3D Immersive Interfaces**: High-performance, WebGL-accelerated interactive particle systems built with `@react-three/fiber` that react to your mouse and completion metrics.
- **Glassmorphism Aesthetic**: Deep, beautiful UI built with Tailwind CSS v4 featuring backdrops, pulsing glows, and dynamic elements.
- **AI Task Breakdown**: OpenAI integration that automatically estimates times and dependencies for vague user inputs.
- **Gamified Progression**: Earn XP, build streaks, and unlock achievements for maintaining deep work hours.

## 💻 Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Three.js, React Three Fiber.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM.
- **Database**: PostgreSQL (currently configured locally).
- **AI**: OpenAI API / LLM Integrations for task breakdown and prediction.

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally
- Git

### 1. Database Setup
Ensure PostgreSQL is running. The default local database URL is configured in the backend `.env`.

### 2. Backend Initialization
```bash
cd backend
npm install
# Set up your environment variables
cp .env.example .env
# Apply the database schema
npx prisma db push
# Start the backend development server (Runs on port 3001)
npm run dev
```

### 3. Frontend Initialization
```bash
cd frontend
npm install
# Start the frontend development server (Runs on port 3000)
npm run dev
```

### 4. Open Application
Navigate to [http://localhost:3000](http://localhost:3000) to view the application!

## 🧪 Testing (Coming Soon)
- The backend API is tested using `Jest` and `Supertest`.
- The frontend components are tested using `React Testing Library`.

## 🚢 Deployment Architecture
- **Frontend Edge**: Deployed globally via Vercel for instant TTFB.
- **Backend API**: Containerized via Docker and deployed on Render/Railway.
- **Database**: Managed PostgreSQL.
