import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET all authors
router.get('/', async (_req, res) => {
  try {
    const authors = await prisma.author.findMany({
      include: { books: { include: { book: { select: { title: true } } } } },
      orderBy: { lastName: 'asc' },
    });
    res.json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create an author
router.post('/', async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    const author = await prisma.author.create({
      data: { firstName, lastName },
    });
    res.status(201).json({ message: 'Author created successfully', author });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update an author
router.put('/:id', async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    const author = await prisma.author.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { firstName, lastName },
    });
    res.json({ message: 'Author updated successfully', author });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE an author (only if no books linked)
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const linked = await prisma.bookAuthor.count({ where: { authorId: id } });
    if (linked > 0) {
      return res.status(400).json({ error: 'Cannot delete author — linked to existing books' });
    }
    await prisma.author.delete({ where: { id } });
    res.json({ message: 'Author deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
