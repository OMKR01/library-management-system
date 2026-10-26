import { useEffect, useState } from 'react';
import {
  fetchBooks,
  fetchAuthors,
  fetchCategories,
  createBook,
  updateBook,
  deleteBook,
  createCopy,
  deleteCopy,
} from '../../api/client';
import Spinner from '../../components/Spinner';
import Toast from '../../components/Toast';

export default function BooksPanel() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);

  // Form state
  const [form, setForm] = useState({
    isbn: '',
    title: '',
    categoryId: '',
    publicationYear: '',
    edition: '',
    authorName: '',
  });

  // Copy form state
  const [copyForm, setCopyForm] = useState({ bookId: '', barcode: '', shelfLocation: '' });
  const [showCopyForm, setShowCopyForm] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchBooks(), fetchAuthors(), fetchCategories()])
      .then(([b, a, c]) => {
        setBooks(b);
        setAuthors(a);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({
      isbn: '',
      title: '',
      categoryId: '',
      publicationYear: '',
      edition: '',
      authorName: '',
    });
    setEditingBook(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await updateBook(editingBook.id, form);
        setToast({ message: 'Book updated successfully', type: 'success' });
      } else {
        await createBook(form);
        setToast({ message: 'Book created successfully', type: 'success' });
      }
      resetForm();
      loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleEdit = (book) => {
    setForm({
      isbn: book.isbn,
      title: book.title,
      categoryId: String(book.categoryId),
      publicationYear: book.publicationYear ? String(book.publicationYear) : '',
      edition: book.edition || '',
      authorName: (book.authors || [])
        .map((a) => `${a.author.firstName} ${a.author.lastName}`)
        .join(', '),
    });
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this book and all its copies?')) return;
    try {
      await deleteBook(id);
      setToast({ message: 'Book deleted', type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleAddCopy = async (e) => {
    e.preventDefault();
    try {
      await createCopy(copyForm);
      setToast({ message: 'Copy added', type: 'success' });
      setCopyForm({ bookId: '', barcode: '', shelfLocation: '' });
      setShowCopyForm(false);
      loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDeleteCopy = async (copyId) => {
    if (!confirm('Delete this copy?')) return;
    try {
      await deleteCopy(copyId);
      setToast({ message: 'Copy deleted', type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const toggleAuthor = (authorId) => {
    const strId = String(authorId);
    setForm((prev) => ({
      ...prev,
      authorIds: prev.authorIds.includes(strId)
        ? prev.authorIds.filter((id) => id !== strId)
        : [...prev.authorIds, strId],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="btn-primary"
          id="add-book-btn"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {showForm ? 'Close Form' : 'Add New Book'}
        </button>

        <button
          onClick={() => setShowCopyForm(!showCopyForm)}
          className="btn-secondary"
          id="add-copy-btn"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {showCopyForm ? 'Cancel Copy' : 'Add Inventory Copy'}
        </button>
      </div>

      {/* Add / Edit Book Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-5" id="book-form">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-[16px] font-semibold text-ink">
              {editingBook ? 'Edit Book Record' : 'Register New Book'}
            </h3>
            <span className="text-[12px] text-mid-gray">All fields marked * are required</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Title *
              </label>
              <input
                className="input-field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                placeholder="e.g. Clean Architecture"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                ISBN *
              </label>
              <input
                className="input-field"
                value={form.isbn}
                onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                required
                placeholder="e.g. 978-0134494166"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Category *
              </label>
              <select
                className="input-field"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Publication Year
              </label>
              <input
                type="number"
                className="input-field"
                value={form.publicationYear}
                onChange={(e) => setForm({ ...form, publicationYear: e.target.value })}
                placeholder="e.g. 2017"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Edition
              </label>
              <input
                className="input-field"
                value={form.edition}
                onChange={(e) => setForm({ ...form, edition: e.target.value })}
                placeholder="e.g. 1st Edition"
              />
            </div>
          </div>

          {/* Author Name Input */}
          <div>
            <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
              Author Name(s) *
            </label>
            <input
              className="input-field"
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              required
              placeholder="e.g. George Orwell or Robert C. Martin"
            />
            <p className="mt-1 text-[11px] text-mid-gray">
              Enter author's name. It will be automatically added to the author directory and linked.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              {editingBook ? 'Update Book' : 'Create Book'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Add Copy Form */}
      {showCopyForm && (
        <form onSubmit={handleAddCopy} className="card space-y-4" id="copy-form">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-[16px] font-semibold text-ink">Add Inventory Copy</h3>
            <span className="text-[12px] text-mid-gray">Barcode must be unique</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Book *
              </label>
              <select
                className="input-field"
                value={copyForm.bookId}
                onChange={(e) => setCopyForm({ ...copyForm, bookId: e.target.value })}
                required
              >
                <option value="">Select book…</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.isbn})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Barcode *
              </label>
              <input
                className="input-field"
                value={copyForm.barcode}
                onChange={(e) => setCopyForm({ ...copyForm, barcode: e.target.value })}
                required
                placeholder="e.g. LIB-006-01"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Shelf Location
              </label>
              <input
                className="input-field"
                value={copyForm.shelfLocation}
                onChange={(e) => setCopyForm({ ...copyForm, shelfLocation: e.target.value })}
                placeholder="e.g. Shelf F1"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              Register Copy
            </button>
            <button type="button" onClick={() => setShowCopyForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Books Catalog Table Card */}
      <div className="card overflow-hidden !p-0">
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <div>
            <h2 className="text-[16px] font-semibold text-ink">Book Catalog</h2>
            <p className="text-[12px] text-mid-gray mt-0.5">
              {books.length} title{books.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
          <span className="badge-soft">{books.length} Titles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-hairline bg-surface-alt text-[12px] uppercase tracking-[0.05em] text-mid-gray font-medium">
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">ISBN</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Authors</th>
                <th className="px-6 py-3">Copies</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {books.map((book) => (
                <>
                  <tr key={book.id} className="transition-colors hover:bg-surface-alt">
                    <td className="px-6 py-3.5 font-medium text-ink">{book.title}</td>
                    <td className="px-6 py-3.5 font-mono text-[13px] text-mid-gray">{book.isbn}</td>
                    <td className="px-6 py-3.5">
                      <span className="badge-soft">{book.category.name}</span>
                    </td>
                    <td className="px-6 py-3.5 text-mid-gray">
                      {book.authors.map((a) => `${a.author.firstName} ${a.author.lastName}`).join(', ') || '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => setExpandedBook(expandedBook === book.id ? null : book.id)}
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink hover:text-neutral-600 transition-colors"
                      >
                        {book.copies.length} cop{book.copies.length !== 1 ? 'ies' : 'y'}
                        <svg
                          className={`h-3.5 w-3.5 transition-transform ${
                            expandedBook === book.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(book)}
                          className="rounded-[18px] p-1.5 text-mid-gray transition-colors hover:bg-canvas hover:text-ink"
                          title="Edit Book"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="rounded-[18px] p-1.5 text-mid-gray transition-colors hover:bg-red-50 hover:text-ember"
                          title="Delete Book"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Copies Sub-view */}
                  {expandedBook === book.id && (
                    <tr key={`copies-${book.id}`}>
                      <td colSpan={6} className="bg-surface-alt px-6 py-4">
                        {book.copies.length === 0 ? (
                          <p className="text-[13px] text-mid-gray py-2">No copies found for this title.</p>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-[11px] font-medium tracking-[0.05em] text-mid-gray uppercase">
                              Registered Inventory Copies
                            </p>
                            <div className="grid gap-2">
                              {book.copies.map((copy) => (
                                <div
                                  key={copy.id}
                                  className="flex items-center justify-between rounded-[10px] border border-hairline bg-paper px-4 py-2.5"
                                >
                                  <div className="flex items-center gap-4">
                                    <span className="font-mono text-[13px] text-ink">{copy.barcode}</span>
                                    <span className="text-[13px] text-mid-gray">
                                      {copy.shelfLocation || 'No shelf allocated'}
                                    </span>
                                    <span
                                      className={
                                        copy.status === 'AVAILABLE' ? 'badge-soft' : 'badge-solid'
                                      }
                                    >
                                      {copy.status}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteCopy(copy.id)}
                                    disabled={copy.status === 'BORROWED'}
                                    className="rounded-[18px] p-1.5 text-mid-gray transition-colors hover:bg-red-50 hover:text-ember disabled:opacity-30 disabled:cursor-not-allowed"
                                    title={
                                      copy.status === 'BORROWED'
                                        ? 'Cannot delete: Currently borrowed'
                                        : 'Delete copy'
                                    }
                                  >
                                    <svg
                                      className="h-3.5 w-3.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}

              {books.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-mid-gray">
                    No books in catalog. Click "Add New Book" to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
