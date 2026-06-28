import { Router, Request, Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import { GoogleGenAI } from '@google/genai';
import prisma from '../prisma';
import { z } from 'zod';

const router = Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' });

// Get tasks for the authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@clerk.user`, // Still a placeholder, but better than generic
          xp: 0,
          level: 1,
          streak: 0
        }
      });
    }

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

    const taskSchema = z.object({
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
      deadline: z.string().optional()
    });

    const parsedBody = taskSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsedBody.error });
    }

    const { title, description, priority, deadline } = parsedBody.data;
    
    // Get the internal DB user ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let subTasksToCreate: { title: string }[] = [];

    // If the task title is reasonably descriptive, auto-generate subtasks
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy' && title.length >= 10) {
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

    const taskData: any = {
      title,
      description,
      priority,
      userId: user.id
    };

    if (deadline) {
      taskData.deadline = {
        create: {
          date: new Date(deadline),
          isUrgent: priority === 'CRITICAL'
        }
      };
    }

    if (subTasksToCreate.length > 0) {
      taskData.subTasks = {
        create: subTasksToCreate
      };
    }

    const task = await prisma.task.create({
      data: taskData,
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

    const id = req.params.id as string;
    
    const statusSchema = z.object({
      status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    });
    
    const parsedBody = statusSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsedBody.error });
    }
    
    const { status } = parsedBody.data;

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

    if (status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
      const xpGained = 50;
      const newXp = user.xp + xpGained;
      const newLevel = Math.floor(newXp / 1000) + 1;
      const newStreak = user.streak + 1;

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          xp: newXp,
          level: newLevel,
          streak: newStreak
        }
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

export default router;
