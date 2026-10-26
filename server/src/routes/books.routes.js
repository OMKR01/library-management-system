import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// Helper to resolve or create authors from authorIds or authorName string
async function resolveAuthorIds({ authorIds, authorName }) {
  let ids = [];
  if (Array.isArray(authorIds) && authorIds.length > 0) {
    ids = authorIds.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));
  }

  if (authorName && typeof authorName === 'string' && authorName.trim()) {
    const rawNames = authorName.split(',').map((s) => s.trim()).filter(Boolean);
    for (const fullName of rawNames) {
      const parts = fullName.split(/\s+/);
      const firstName = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0];
      const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0];

      let author = await prisma.author.findFirst({
        where: {
          firstName,
          lastName,
        },
      });

      if (!author) {
        author = await prisma.author.create({
          data: { firstName, lastName },
        });
      }

      if (!ids.includes(author.id)) {
        ids.push(author.id);
      }
    }
  }

  return ids;
}

// GET all books with authors, category, and copy counts
router.get('/', async (_req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        category: true,
        authors: { include: { author: true } },
        copies: { select: { id: true, barcode: true, status: true, shelfLocation: true } },
      },
      orderBy: { title: 'asc' },
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single book by id
router.get('/:id', async (req, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(req.params.id, 10) },
      include: {
        category: true,
        authors: { include: { author: true } },
        copies: { select: { id: true, barcode: true, status: true, shelfLocation: true } },
      },
    });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new book
router.post('/', async (req, res) => {
  const { isbn, title, categoryId, publicationYear, edition, authorIds, authorName } = req.body;
  try {
    const resolvedIds = await resolveAuthorIds({ authorIds, authorName });

    const book = await prisma.book.create({
      data: {
        isbn,
        title,
        categoryId: parseInt(categoryId, 10),
        publicationYear: publicationYear ? parseInt(publicationYear, 10) : null,
        edition: edition || null,
        authors: {
          create: resolvedIds.map((id) => ({ authorId: id })),
        },
      },
      include: {
        category: true,
        authors: { include: { author: true } },
      },
    });
    res.status(201).json({ message: 'Book created successfully', book });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'A book with this ISBN already exists' });
    }
    res.status(400).json({ error: err.message });
  }
});

// PUT update a book
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { isbn, title, categoryId, publicationYear, edition, authorIds, authorName } = req.body;
  try {
    const resolvedIds = await resolveAuthorIds({ authorIds, authorName });

    await prisma.bookAuthor.deleteMany({ where: { bookId: id } });
    const book = await prisma.book.update({
      where: { id },
      data: {
        isbn,
        title,
        categoryId: parseInt(categoryId, 10),
        publicationYear: publicationYear ? parseInt(publicationYear, 10) : null,
        edition: edition || null,
        authors: {
          create: resolvedIds.map((aid) => ({ authorId: aid })),
        },
      },
      include: {
        category: true,
        authors: { include: { author: true } },
      },
    });
    res.json({ message: 'Book updated successfully', book });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a book (only if no copies are borrowed)
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const borrowedCopies = await prisma.bookCopy.findMany({
      where: { bookId: id, status: 'BORROWED' },
    });
    if (borrowedCopies.length > 0) {
      return res.status(400).json({ error: 'Cannot delete book — some copies are currently borrowed' });
    }
    // Delete copies, author links, then book
    await prisma.bookCopy.deleteMany({ where: { bookId: id } });
    await prisma.bookAuthor.deleteMany({ where: { bookId: id } });
    await prisma.book.delete({ where: { id } });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
