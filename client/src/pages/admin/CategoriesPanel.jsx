import { useEffect, useState } from 'react';
import { fetchCategories, createCategory, deleteCategory } from '../../api/client';
import Spinner from '../../components/Spinner';
import Toast from '../../components/Toast';

export default function CategoriesPanel() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCategory({ name });
      setToast({ message: 'Category created successfully', type: 'success' });
      setName('');
      setShowForm(false);
      loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this taxonomy category?')) return;
    try {
      await deleteCategory(id);
      setToast({ message: 'Category deleted', type: 'success' });
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
        id="add-category-btn"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {showForm ? 'Close Form' : 'Add New Category'}
      </button>

      {/* Category Creation Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4" id="category-form">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-[16px] font-semibold text-ink">New Category Taxonomy</h3>
            <span className="text-[12px] text-mid-gray">Classification name</span>
          </div>
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="w-full flex-1">
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Category Name *
              </label>
              <input
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Distributed Computing"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary whitespace-nowrap">
                Create Category
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="card group flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-ink">{cat.name}</h3>
                  <p className="mt-0.5 text-[12px] text-mid-gray">
                    {cat.books.length} title{cat.books.length !== 1 ? 's' : ''} categorized
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={cat.books.length > 0}
                  className="rounded-[18px] p-1.5 text-mid-gray transition-colors hover:bg-red-50 hover:text-ember disabled:opacity-30 disabled:cursor-not-allowed"
                  title={
                    cat.books.length > 0
                      ? 'Cannot delete: category has assigned books'
                      : 'Delete category'
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
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-mid-gray mb-1">
                <span>Catalog Density</span>
                <span>{cat.books.length} / 10</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-hairline">
                <div
                  className="h-full rounded-full bg-ink transition-all duration-300"
                  style={{ width: `${Math.min(cat.books.length * 10, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full py-12 text-center text-mid-gray">No categories created yet</div>
        )}
      </div>
    </div>
  );
}
