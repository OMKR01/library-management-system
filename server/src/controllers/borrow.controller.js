import prisma from '../lib/prisma.js';

// Issue a book copy to a member
export const issueBook = async (req, res) => {
  const { barcode, membershipNumber, loanDays = 14 } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const copy = await tx.bookCopy.findUnique({ where: { barcode } });
      if (!copy || copy.status !== 'AVAILABLE') {
        throw new Error('Copy is not available for issue');
      }

      const member = await tx.member.findUnique({
        where: { membershipNumber },
        include: {
          borrowRecords: { where: { returnDate: null } }
        }
      });

      if (!member || !member.isActive) {
        throw new Error('Invalid or inactive member');
      }

      if (member.borrowRecords.length >= member.maxAllowed) {
        throw new Error(`Member loan limit reached (${member.maxAllowed} books)`);
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + parseInt(loanDays, 10));

      const record = await tx.borrowRecord.create({
        data: {
          copyId: copy.id,
          memberId: member.id,
          dueDate
        }
      });

      await tx.bookCopy.update({
        where: { id: copy.id },
        data: { status: 'BORROWED' }
      });

      return record;
    });

    res.status(201).json({ message: 'Book issued successfully', record: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Return a book and calculate overdue fines
export const returnBook = async (req, res) => {
  const { barcode, dailyRate = 1.0 } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const copy = await tx.bookCopy.findUnique({ where: { barcode } });
      if (!copy) throw new Error('Copy barcode not found');

      const record = await tx.borrowRecord.findFirst({
        where: { copyId: copy.id, returnDate: null }
      });
      if (!record) throw new Error('No active borrow record found for this copy');

      const now = new Date();
      await tx.borrowRecord.update({
        where: { id: record.id },
        data: { returnDate: now }
      });

      await tx.bookCopy.update({
        where: { id: copy.id },
        data: { status: 'AVAILABLE' }
      });

      let fine = null;
      if (now > record.dueDate) {
        const diffTime = Math.abs(now - record.dueDate);
        const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const fineAmount = overdueDays * dailyRate;

        fine = await tx.fine.create({
          data: {
            borrowRecordId: record.id,
            amount: fineAmount,
            status: 'UNPAID'
          }
        });
      }

      return { recordId: record.id, fine };
    });

    res.status(200).json({ message: 'Book returned successfully', summary: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};