import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// POST add a copy to a book
router.post('/', async (req, res) => {
  const { bookId, barcode, shelfLocation } = req.body;
  try {
    const copy = await prisma.bookCopy.create({
      data: {
        bookId: parseInt(bookId, 10),
        barcode,
        status: 'AVAILABLE',
        shelfLocation: shelfLocation || null,
      },
      include: { book: { select: { title: true } } },
    });
    res.status(201).json({ message: 'Copy added successfully', copy });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'A copy with this barcode already exists' });
    }
    res.status(400).json({ error: err.message });
  }
});

// DELETE a copy (only if not borrowed)
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const copy = await prisma.bookCopy.findUnique({ where: { id } });
    if (!copy) return res.status(404).json({ error: 'Copy not found' });
    if (copy.status === 'BORROWED') {
      return res.status(400).json({ error: 'Cannot delete copy — currently borrowed' });
    }
    // Delete related fines and borrow records
    const borrowIds = (await prisma.borrowRecord.findMany({ where: { copyId: id }, select: { id: true } })).map(b => b.id);
    if (borrowIds.length > 0) {
      await prisma.fine.deleteMany({ where: { borrowRecordId: { in: borrowIds } } });
      await prisma.borrowRecord.deleteMany({ where: { copyId: id } });
    }
    await prisma.bookCopy.delete({ where: { id } });
    res.json({ message: 'Copy deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
