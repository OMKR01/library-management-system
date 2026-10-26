import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET all active borrows (not yet returned)
router.get('/active', async (_req, res) => {
  try {
    const borrows = await prisma.borrowRecord.findMany({
      where: { returnDate: null },
      include: {
        copy: { include: { book: { select: { title: true } } } },
        member: { select: { name: true, membershipNumber: true } },
      },
      orderBy: { issueDate: 'desc' },
    });
    res.json(borrows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
