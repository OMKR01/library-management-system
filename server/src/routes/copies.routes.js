import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET all book copies with book title and current status
router.get('/', async (_req, res) => {
  try {
    const copies = await prisma.bookCopy.findMany({
      include: { book: { select: { title: true, isbn: true } } },
      orderBy: { barcode: 'asc' },
    });
    res.json(copies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
