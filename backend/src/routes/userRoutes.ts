import { Router, Request, Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';
import prisma from '../prisma';

const router = Router();

// Get current user profile and stats
router.get('/me', async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Lazy User Creation
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: `${userId}@placeholder.com`, 
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

export default router;
