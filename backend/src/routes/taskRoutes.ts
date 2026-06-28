import { Router, Request, Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import { GoogleGenAI } from '@google/genai';
import prisma from '../prisma';

const router = Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' });

// Get tasks for the authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Lazy User Creation (if they don't exist yet)
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: `${userId}@placeholder.com`, // Temp email if not fetched from clerk
      }
    });

    const tasks = await prisma.task.findMany({
      where: { user: { clerkId: userId } },
      include: { subTasks: true, deadline: true }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a task
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, description, priority } = req.body;
    
    // Get the internal DB user ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let subTasksToCreate: { title: string }[] = [];

    // If the task title is relatively short/vague, auto-generate subtasks
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy' && title.length < 50) {
      try {
        const prompt = `Break down the following task into 3 to 5 actionable subtasks. Return ONLY a valid JSON array of strings representing the subtask titles, and nothing else. Do not use markdown blocks. Task: "${title}". Description: "${description || 'None'}"`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        
        const text = response.text || '[]';
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        
        if (Array.isArray(parsed)) {
          subTasksToCreate = parsed.map((t: string) => ({ title: t }));
        }
      } catch (err) {
        console.error('Failed to generate subtasks with Gemini:', err);
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        userId: user.id,
        subTasks: subTasksToCreate.length > 0 ? {
          create: subTasksToCreate
        } : undefined
      },
      include: { subTasks: true, deadline: true }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verify ownership
    const existingTask = await prisma.task.findFirst({
      where: { id, userId: user.id }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
      include: { subTasks: true, deadline: true }
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

export default router;
