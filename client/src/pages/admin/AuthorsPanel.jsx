import { useEffect, useState } from 'react';
import { fetchAuthors, createAuthor, deleteAuthor } from '../../api/client';
import Spinner from '../../components/Spinner';
import Toast from '../../components/Toast';

export default function AuthorsPanel() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '' });

  const loadData = () => {
    setLoading(true);
    fetchAuthors()
      .then(setAuthors)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAuthor(form);
      setToast({ message: 'Author created successfully', type: 'success' });
      setForm({ firstName: '', lastName: '' });
      setShowForm(false);
      loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this author record?')) return;
    try {
      await deleteAuthor(id);
      setToast({ message: 'Author deleted', type: 'success' });
      loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
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

      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary"
        id="add-author-btn"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {showForm ? 'Close Form' : 'Add New Author'}
      </button>

      {/* Author Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4" id="author-form">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-[16px] font-semibold text-ink">Register Author</h3>
            <span className="text-[12px] text-mid-gray">Both fields are required</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                First Name *
              </label>
              <input
                className="input-field"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
                placeholder="e.g. Robert"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Last Name *
              </label>
              <input
                className="input-field"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
                placeholder="e.g. Martin"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              Create Author
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Authors Catalog Table Card */}
      <div className="card overflow-hidden !p-0">
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <div>
            <h2 className="text-[16px] font-semibold text-ink">Author Catalog</h2>
            <p className="text-[12px] text-mid-gray mt-0.5">
              {authors.length} author{authors.length !== 1 ? 's' : ''} on record
            </p>
          </div>
          <span className="badge-soft">{authors.length} Authors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-hairline bg-surface-alt text-[12px] uppercase tracking-[0.05em] text-mid-gray font-medium">
                <th className="px-6 py-3">Author Name</th>
                <th className="px-6 py-3">Linked Catalog Books</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {authors.map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-surface-alt">
                  <td className="px-6 py-3.5 font-medium text-ink">
                    {a.firstName} {a.lastName}
                  </td>
                  <td className="px-6 py-3.5 text-mid-gray">
                    {a.books.length > 0 ? (
                      a.books.map((b) => b.book.title).join(', ')
                    ) : (
                      <span className="text-mid-gray/50 italic">No linked titles</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={a.books.length > 0}
                      className="rounded-[18px] p-1.5 text-mid-gray transition-colors hover:bg-red-50 hover:text-ember disabled:opacity-30 disabled:cursor-not-allowed"
                      title={
                        a.books.length > 0
                          ? 'Cannot delete: author has linked books'
                          : 'Delete author'
                      }
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {authors.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-mid-gray">
                    No authors on file
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
