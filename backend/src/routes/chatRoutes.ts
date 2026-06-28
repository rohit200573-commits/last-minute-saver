import { Router, Request, Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import { GoogleGenAI } from '@google/genai';
import prisma from '../prisma';
import { z } from 'zod';

const router = Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' });

router.post('/', requireAuth(), async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy') {
      return res.status(503).json({ error: 'AI integration is not configured on the server.' });
    }

    const chatSchema = z.object({
      message: z.string().min(1).max(500)
    });

    const parsedBody = chatSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsedBody.error });
    }

    const { message } = parsedBody.data;

    // Fetch user context for better AI responses
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        tasks: {
          where: { status: 'PENDING' },
          take: 5
        }
      }
    });

    const pendingTasksContext = user?.tasks.map(t => `- ${t.title} (${t.priority})`).join('\n') || 'None';

    const systemPrompt = `You are a futuristic AI Productivity Copilot. You are highly intelligent, concise, and proactive.
Your goal is to help the user manage their tasks and overcome procrastination.
Here are their current top pending tasks:
${pendingTasksContext}

User message: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('Chat AI Error:', error);
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

export default router;
