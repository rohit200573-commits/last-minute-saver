import { Router, Request, Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import prisma from '../prisma';

const router = Router();

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
      include: { subTasks: true }
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

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        userId: user.id
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

export default router;
