import { Router, Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import prisma from '../prisma';

const router = Router();

// Get gamification stats for a user
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get internal user id using clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { xp: true, level: true, streak: true, id: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gamification stats' });
  }
});

// Create a focus session
router.post('/focus-session', async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { duration } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const session = await prisma.focusSession.create({
      data: {
        duration,
        userId: user.id,
        isCompleted: true
      }
    });
    
    // Simple XP logic: 1 XP per minute of focus
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: duration } }
    });
    
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log focus session' });
  }
});

export default router;
