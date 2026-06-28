# Last Minute Life Saver 🦸‍♂️⏱️

> *The AI-powered productivity app that turns procrastination into gamified execution.*

![Hero Image](https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## Features

- **Procrastination Probability Matrix**: Real-time evaluation of how likely you are to procrastinate a task based on its creation date and approaching deadline.
- **Emergency Rescue Mode**: A distraction-free environment that locks you in when a deadline is under 24 hours away.
- **AI Subtask Generation**: Powered by **Google Gemini 2.5 Flash**, the app automatically breaks down vague or overwhelming tasks into 3-5 actionable subtasks.
- **Focus Timer (Pomodoro)**: A beautiful, built-in Deep Work session timer that grants you XP upon completion.
- **Gamified Productivity**: Gain XP, level up, and build streaks by completing tasks and focus sessions.
- **Immersive 3D UI**: Built with Framer Motion and Three.js (React Three Fiber) for a futuristic, smooth, and interactive digital twin aesthetic.

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion, React Three Fiber, Lucide Icons.
- **Backend**: Node.js, Express, Prisma, PostgreSQL (Supabase ready).
- **Authentication**: Clerk.
- **AI Integration**: `@google/genai` (Gemini).

## Live Demo
Check out the live deployment here: https://last-minute-saver-mh1fa3awn-rohit200573-commits-projects.vercel.app/

## Getting Started

### Prerequisites
- Node.js (v18+)
- Postgres Database (or Supabase account)
- Clerk Account (for auth)
- Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/last-minute-saver.git
   cd last-minute-saver
   ```

2. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   # Create a .env.local file using the variables in the root .env.example
   npm run dev
   ```

3. **Setup Backend:**
   Open a new terminal window:
   ```bash
   cd backend
   npm install
   # Create a .env file using the variables in the root .env.example
   # Add your GEMINI_API_KEY and Supabase DATABASE_URL
   npx prisma db push
   npm run dev
   ```

4. **Open the App:**
   Navigate to `http://localhost:3000` in your browser.

## Deployment

This app is production-ready for **Vercel** (frontend) and **Render** (backend).
- **Frontend**: Connect your repository to Vercel and set the Root Directory to `frontend`.
- **Backend**: A `render.yaml` Blueprint is included in the root folder. You can deploy it instantly on Render by creating a New Blueprint Instance.

---
*Built with ❤️ and AI.*
