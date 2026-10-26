import { useEffect, useState } from 'react';
import { fetchActiveBorrows, returnBook } from '../api/client';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

export default function ReturnPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [barcode, setBarcode] = useState('');

  const loadData = () => {
    setLoading(true);
    fetchActiveBorrows()
      .then(setBorrows)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!barcode) return;
    setSubmitting(true);
    try {
      const data = await returnBook({ barcode });
      const fineMsg = data.summary.fine
        ? ` Fine of $${Number(data.summary.fine.amount).toFixed(2)} applied.`
        : '';
      setToast({ message: `${data.message}${fineMsg}`, type: 'success' });
      setBarcode('');
      loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-[30px] font-semibold leading-[1.2] tracking-[-0.75px] text-ink">Return Book</h1>
        <p className="mt-1 text-[14px] text-mid-gray">Process returned copies and auto-calculate overdue fines</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form Card */}
        <form onSubmit={handleSubmit} className="card space-y-5 lg:col-span-2" id="return-form">
          <h2 className="text-[16px] font-semibold text-ink border-b border-hairline pb-3">Check-in Process</h2>

          <div>
            <label htmlFor="return-barcode" className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
              Borrowed Copy (Barcode) *
            </label>
            <select
              id="return-barcode"
              className="input-field"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              required
            >
              <option value="">Select a borrowed copy…</option>
              {borrows.map((b) => (
                <option key={b.id} value={b.copy.barcode}>
                  {b.copy.barcode} — {b.copy.book.title} ({b.member.name})
                </option>
              ))}
            </select>
          </div>

          {/* Selected borrow details preview */}
          {barcode && (() => {
            const selected = borrows.find((b) => b.copy.barcode === barcode);
            if (!selected) return null;
            const isOverdue = new Date(selected.dueDate) < new Date();
            return (
              <div className="rounded-[10px] border border-hairline bg-surface-alt p-4 space-y-2.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-mid-gray">Book Title</span>
                  <span className="font-medium text-ink">{selected.copy.book.title}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-mid-gray">Member</span>
                  <span className="text-ink">{selected.member.name}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-mid-gray">Issued Date</span>
                  <span className="text-ink">{new Date(selected.issueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-mid-gray">Due Date</span>
                  <span className={isOverdue ? 'font-semibold text-ember' : 'text-ink'}>
                    {new Date(selected.dueDate).toLocaleDateString()}
                    {isOverdue && ' (OVERDUE)'}
                  </span>
                </div>
              </div>
            );
          })()}

          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={submitting || !barcode}
              id="return-submit-btn"
            >
              {submitting ? <Spinner size="sm" /> : null}
              {submitting ? 'Processing Return…' : 'Process Return'}
            </button>
          </div>
        </form>

        {/* Active borrows table card */}
        <div className="card overflow-hidden !p-0 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
            <div>
              <h2 className="text-[16px] font-semibold text-ink">Currently Borrowed</h2>
              <p className="text-[12px] text-mid-gray mt-0.5">Click any active borrow to select for return</p>
            </div>
            <span className="badge-soft">{borrows.length} Active Loans</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-hairline bg-surface-alt text-[12px] uppercase tracking-[0.05em] text-mid-gray font-medium">
                  <th className="px-6 py-3">Barcode</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {borrows.map((b) => {
                  const isOverdue = new Date(b.dueDate) < new Date();
                  return (
                    <tr
                      key={b.id}
                      className={`cursor-pointer transition-colors hover:bg-surface-alt ${
                        barcode === b.copy.barcode ? 'bg-surface-alt font-medium' : ''
                      }`}
                      onClick={() => setBarcode(b.copy.barcode)}
                    >
                      <td className="px-6 py-3.5 font-mono text-[13px] text-ink">{b.copy.barcode}</td>
                      <td className="px-6 py-3.5 text-ink">{b.copy.book.title}</td>
                      <td className="px-6 py-3.5 text-mid-gray">{b.member.name}</td>
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
                {borrows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-mid-gray">No active borrows currently</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
