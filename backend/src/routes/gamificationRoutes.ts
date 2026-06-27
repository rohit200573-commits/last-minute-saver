import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Get gamification stats for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true, streak: true }
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
router.post('/focus-session', async (req, res) => {
  try {
    const { duration, userId } = req.body;
    const session = await prisma.focusSession.create({
      data: {
        duration,
        userId,
        isCompleted: true
      }
    });
    
    // Simple XP logic: 1 XP per minute of focus
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: duration } }
    });
    
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log focus session' });
  }
});

export default router;
