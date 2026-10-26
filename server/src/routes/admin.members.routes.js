import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET all members (including inactive)
router.get('/all', async (_req, res) => {
  try {
    const members = await prisma.member.findMany({
      include: { borrowRecords: { where: { returnDate: null }, select: { id: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a member
router.post('/', async (req, res) => {
  const { membershipNumber, name, email, phone, memberType, maxAllowed } = req.body;
  try {
    const member = await prisma.member.create({
      data: {
        membershipNumber,
        name,
        email,
        phone: phone || null,
        memberType: memberType || 'STANDARD',
        maxAllowed: maxAllowed ? parseInt(maxAllowed, 10) : 3,
      },
    });
    res.status(201).json({ message: 'Member created successfully', member });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Membership number or email already exists' });
    }
    res.status(400).json({ error: err.message });
  }
});

// PUT update a member
router.put('/:id', async (req, res) => {
  const { name, email, phone, memberType, maxAllowed, isActive } = req.body;
  try {
    const member = await prisma.member.update({
      where: { id: parseInt(req.params.id, 10) },
      data: {
        name,
        email,
        phone: phone || null,
        memberType,
        maxAllowed: maxAllowed ? parseInt(maxAllowed, 10) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });
    res.json({ message: 'Member updated successfully', member });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a member (only if no active borrows)
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const activeBorrows = await prisma.borrowRecord.count({
      where: { memberId: id, returnDate: null },
    });
    if (activeBorrows > 0) {
      return res.status(400).json({ error: 'Cannot delete member — has active borrows' });
    }
    // Delete related fines and borrow records first
    const borrowIds = (await prisma.borrowRecord.findMany({ where: { memberId: id }, select: { id: true } })).map(b => b.id);
    if (borrowIds.length > 0) {
      await prisma.fine.deleteMany({ where: { borrowRecordId: { in: borrowIds } } });
      await prisma.borrowRecord.deleteMany({ where: { memberId: id } });
    }
    await prisma.member.delete({ where: { id } });
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
