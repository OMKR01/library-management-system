import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET all categories
router.get('/', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { books: { select: { id: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a category
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Category already exists' });
    }
    res.status(400).json({ error: err.message });
  }
});

// DELETE a category (only if no books linked)
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const linked = await prisma.book.count({ where: { categoryId: id } });
    if (linked > 0) {
      return res.status(400).json({ error: 'Cannot delete category — books are assigned to it' });
    }
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
