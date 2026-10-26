import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();


async function main() {
  // Categories
  const fiction = await prisma.category.create({ data: { name: 'Fiction' } });
  const science = await prisma.category.create({ data: { name: 'Science' } });
  const history = await prisma.category.create({ data: { name: 'History' } });
  const tech = await prisma.category.create({ data: { name: 'Technology' } });

  // Authors
  const orwell = await prisma.author.create({ data: { firstName: 'George', lastName: 'Orwell' } });
  const hawking = await prisma.author.create({ data: { firstName: 'Stephen', lastName: 'Hawking' } });
  const yuval = await prisma.author.create({ data: { firstName: 'Yuval Noah', lastName: 'Harari' } });
  const knuth = await prisma.author.create({ data: { firstName: 'Donald', lastName: 'Knuth' } });
  const austen = await prisma.author.create({ data: { firstName: 'Jane', lastName: 'Austen' } });

  // Books
  const book1 = await prisma.book.create({
    data: {
      isbn: '978-0451524935',
      title: '1984',
      categoryId: fiction.id,
      publicationYear: 1949,
      edition: '1st',
      authors: { create: [{ authorId: orwell.id }] },
    },
  });
  const book2 = await prisma.book.create({
    data: {
      isbn: '978-0553380163',
      title: 'A Brief History of Time',
      categoryId: science.id,
      publicationYear: 1988,
      edition: '10th Anniversary',
      authors: { create: [{ authorId: hawking.id }] },
    },
  });
  const book3 = await prisma.book.create({
    data: {
      isbn: '978-0062316097',
      title: 'Sapiens: A Brief History of Humankind',
      categoryId: history.id,
      publicationYear: 2011,
      edition: '1st',
      authors: { create: [{ authorId: yuval.id }] },
    },
  });
  const book4 = await prisma.book.create({
    data: {
      isbn: '978-0201896831',
      title: 'The Art of Computer Programming',
      categoryId: tech.id,
      publicationYear: 1968,
      edition: '3rd',
      authors: { create: [{ authorId: knuth.id }] },
    },
  });
  const book5 = await prisma.book.create({
    data: {
      isbn: '978-0141439518',
      title: 'Pride and Prejudice',
      categoryId: fiction.id,
      publicationYear: 1813,
      edition: 'Penguin Classics',
      authors: { create: [{ authorId: austen.id }] },
    },
  });

  // Book Copies (2 copies each)
  const copies = [];
  for (const [i, book] of [book1, book2, book3, book4, book5].entries()) {
    for (let j = 1; j <= 2; j++) {
      const copy = await prisma.bookCopy.create({
        data: {
          bookId: book.id,
          barcode: `LIB-${String(i + 1).padStart(3, '0')}-${String(j).padStart(2, '0')}`,
          status: 'AVAILABLE',
          shelfLocation: `Shelf ${String.fromCharCode(65 + i)}${j}`,
        },
      });
      copies.push(copy);
    }
  }

  // Members
  await prisma.member.createMany({
    data: [
      {
        membershipNumber: 'MEM-001',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '555-0101',
        memberType: 'STUDENT',
        maxAllowed: 3,
      },
      {
        membershipNumber: 'MEM-002',
        name: 'Bob Williams',
        email: 'bob@example.com',
        phone: '555-0102',
        memberType: 'FACULTY',
        maxAllowed: 5,
      },
      {
        membershipNumber: 'MEM-003',
        name: 'Carol Davis',
        email: 'carol@example.com',
        phone: '555-0103',
        memberType: 'STANDARD',
        maxAllowed: 3,
      },
    ],
  });

  console.log('✅ Seed data created successfully');
  console.log(`   📚 ${5} books, ${copies.length} copies`);
  console.log('   👥 3 members (MEM-001, MEM-002, MEM-003)');
  console.log('   📖 Barcodes: LIB-001-01 through LIB-005-02');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
