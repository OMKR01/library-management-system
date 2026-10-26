import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET all active members
router.get('/', async (_req, res) => {
  try {
    const members = await prisma.member.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
