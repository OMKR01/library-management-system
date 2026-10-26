import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchCopies, fetchMembers, fetchActiveBorrows, fetchBooks } from '../api/client';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const [copies, setCopies] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    Promise.all([fetchCopies(), fetchMembers(), fetchActiveBorrows(), fetchBooks()])
      .then(([c, m, b, bk]) => {
        setCopies(c);
        setMembers(m);
        setBorrows(b);
        setBooks(bk);
      })
      .finally(() => setLoading(false));
  }, []);

  const available = copies.filter((c) => c.status === 'AVAILABLE').length;
  const borrowed = copies.filter((c) => c.status === 'BORROWED').length;

  const stats = [
    {
      label: 'TOTAL COPIES',
      value: copies.length,
      icon: (
        <svg className="h-5 w-5 text-mid-gray" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      label: 'AVAILABLE',
      value: available,
      icon: (
        <svg className="h-5 w-5 text-mid-gray" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'BORROWED',
      value: borrowed,
      icon: (
        <svg className="h-5 w-5 text-mid-gray" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'ACTIVE MEMBERS',
      value: members.length,
      icon: (
        <svg className="h-5 w-5 text-mid-gray" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
  ];

  // Available unique categories
  const categoriesList = useMemo(() => {
    const set = new Set();
    books.forEach((b) => {
      if (b.category?.name) set.add(b.category.name);
    });
    return ['ALL', ...Array.from(set)];
  }, [books]);

  // Filtered books based on Search query (books, authors, categories) & filters
  const filteredBooks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return books.filter((book) => {
      // Category filter
      if (selectedCategory !== 'ALL' && book.category?.name !== selectedCategory) {
        return false;
      }

      // Available copies count
      const availableCopies = (book.copies || []).filter((c) => c.status === 'AVAILABLE');
      if (availableOnly && availableCopies.length === 0) {
        return false;
      }

      // Query matching
      if (!q) return true;

      const titleMatch = book.title.toLowerCase().includes(q);
      const isbnMatch = book.isbn.toLowerCase().includes(q);
      const categoryMatch = book.category?.name?.toLowerCase().includes(q);
      const authorMatch = (book.authors || []).some((a) => {
        const full = `${a.author.firstName} ${a.author.lastName}`.toLowerCase();
        return full.includes(q);
      });
      const copyMatch = (book.copies || []).some(
        (c) =>
          c.barcode.toLowerCase().includes(q) ||
          (c.shelfLocation && c.shelfLocation.toLowerCase().includes(q))
      );

      return titleMatch || isbnMatch || categoryMatch || authorMatch || copyMatch;
    });
  }, [books, searchQuery, selectedCategory, availableOnly]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-[30px] font-semibold leading-[1.2] tracking-[-0.75px] text-ink">Dashboard</h1>
        <p className="mt-1 text-[14px] text-mid-gray">Circulation status, catalog search, and real-time inventory overview</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium tracking-[0.05em] text-mid-gray">{s.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-canvas border border-hairline">
                {s.icon}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-[36px] font-semibold leading-[1.11] tracking-[-0.025em] text-ink">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar & Book Catalog Search Section */}
      <div className="card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
          <div>
            <h2 className="text-[18px] font-semibold tracking-tight text-ink">
              Search Catalog & Inventory
            </h2>
            <p className="text-[13px] text-mid-gray">
              Instant search across titles, authors, categories, ISBNs, and shelf locations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-mid-gray font-medium">
              {filteredBooks.length} result{filteredBooks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-mid-gray">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            id="dashboard-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books by title, author name (e.g. Orwell, Knuth), or category (e.g. Fiction, Science)..."
            className="input-field pl-11 pr-10 py-2.5 text-[14px]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-mid-gray hover:text-ink transition-colors"
              title="Clear search"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray mr-1">
              Category:
            </span>
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-[18px] px-3 py-1 text-[12px] font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-ink text-canvas shadow-sm'
                    : 'border border-hairline bg-canvas text-mid-gray hover:text-ink hover:bg-hairline'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer text-[12px] font-medium text-ink">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-hairline accent-ink cursor-pointer"
            />
            <span>Available on shelf only</span>
          </label>
        </div>

        {/* Search Results Table */}
        <div className="overflow-hidden rounded-[14px] border border-hairline">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-hairline bg-surface-alt text-[12px] uppercase tracking-[0.05em] text-mid-gray font-medium">
                  <th className="px-5 py-3">Book Title</th>
                  <th className="px-5 py-3">Author(s)</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Shelf Locations</th>
                  <th className="px-5 py-3">Copies Available</th>
                  <th className="px-5 py-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filteredBooks.map((book) => {
                  const totalCopies = book.copies?.length || 0;
                  const availableCopies = (book.copies || []).filter((c) => c.status === 'AVAILABLE');
                  const isAvailable = availableCopies.length > 0;
                  const authorsStr = (book.authors || [])
                    .map((a) => `${a.author.firstName} ${a.author.lastName}`)
                    .join(', ') || '—';
                  const shelfLocations = Array.from(
                    new Set((book.copies || []).map((c) => c.shelfLocation).filter(Boolean))
                  ).join(', ') || 'General Stacks';

                  return (
                    <tr key={book.id} className="transition-colors hover:bg-surface-alt">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-ink">{book.title}</p>
                        <p className="text-[11px] font-mono text-mid-gray">ISBN: {book.isbn}</p>
                      </td>
                      <td className="px-5 py-3.5 text-ink">{authorsStr}</td>
                      <td className="px-5 py-3.5">
                        <span className="badge-soft">{book.category?.name || 'Unassigned'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-mid-gray text-[13px]">{shelfLocations}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              isAvailable ? 'badge-soft text-ink' : 'badge-destructive'
                            }
                          >
                            {availableCopies.length} of {totalCopies} Available
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isAvailable ? (
                          <Link
                            to="/issue"
                            className="btn-outline text-[12px] py-1 px-3"
                            title="Issue an available copy of this book"
                          >
                            Issue Book
                          </Link>
                        ) : (
                          <span className="text-[12px] text-mid-gray/60 italic">Borrowed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredBooks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-mid-gray">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="h-8 w-8 text-mid-gray/40 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                          />
                        </svg>
                        <p className="text-[14px] font-medium text-ink">No books found</p>
                        <p className="text-[12px] text-mid-gray mt-0.5">
                          {searchQuery
                            ? `No records matching "${searchQuery}" in titles, authors, or categories.`
                            : 'No catalog records match the selected category filter.'}
                        </p>
                        {searchQuery && (
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedCategory('ALL');
                              setAvailableOnly(false);
                            }}
                            className="mt-3 text-[12px] font-medium text-ink underline hover:text-mid-gray transition-colors"
                          >
                            Clear search and filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Active Borrows Table Card */}
      <div className="card overflow-hidden !p-0">
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <div>
            <h2 className="text-[16px] font-semibold text-ink">Active Borrows</h2>
            <p className="text-[12px] text-mid-gray mt-0.5">{borrows.length} loan record{borrows.length !== 1 ? 's' : ''} in circulation</p>
          </div>
          <span className="badge-soft">{borrows.length} Active</span>
        </div>

        {borrows.length === 0 ? (
          <div className="px-6 py-12 text-center text-[14px] text-mid-gray">
            No active borrows — all books are currently returned to the shelves.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-hairline bg-surface-alt text-[12px] uppercase tracking-[0.05em] text-mid-gray font-medium">
                  <th className="px-6 py-3">Book Title</th>
                  <th className="px-6 py-3">Barcode</th>
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3">Issued</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {borrows.map((b) => {
                  const isOverdue = new Date(b.dueDate) < new Date();
                  return (
                    <tr key={b.id} className="transition-colors hover:bg-surface-alt">
                      <td className="px-6 py-3.5 font-medium text-ink">{b.copy.book.title}</td>
                      <td className="px-6 py-3.5 font-mono text-[13px] text-mid-gray">{b.copy.barcode}</td>
                      <td className="px-6 py-3.5 text-ink">{b.member.name}</td>
                      <td className="px-6 py-3.5 text-mid-gray">{new Date(b.issueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-3.5 text-mid-gray">{new Date(b.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-3.5">
                        {isOverdue ? (
                          <span className="badge-destructive">Overdue</span>
                        ) : (
                          <span className="badge-solid">Active</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
