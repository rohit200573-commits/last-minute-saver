import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Get tasks for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: { subTasks: true }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, userId } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        userId
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

export default router;
