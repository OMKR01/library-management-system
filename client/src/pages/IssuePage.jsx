import { useEffect, useState } from 'react';
import { fetchCopies, fetchMembers, issueBook } from '../api/client';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

export default function IssuePage() {
  const [copies, setCopies] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [barcode, setBarcode] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [loanDays, setLoanDays] = useState('14');

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchCopies(), fetchMembers()])
      .then(([c, m]) => {
        setCopies(c);
        setMembers(m);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const availableCopies = copies.filter((c) => c.status === 'AVAILABLE');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!barcode || !membershipNumber) return;
    setSubmitting(true);
    try {
      const data = await issueBook({ barcode, membershipNumber, loanDays });
      setToast({ message: data.message, type: 'success' });
      setBarcode('');
      setMembershipNumber('');
      setLoanDays('14');
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
        <h1 className="text-[30px] font-semibold leading-[1.2] tracking-[-0.75px] text-ink">Issue Book</h1>
        <p className="mt-1 text-[14px] text-mid-gray">Loan an available book copy to an active library member</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form Card */}
        <form onSubmit={handleSubmit} className="card space-y-5 lg:col-span-2" id="issue-form">
          <h2 className="text-[16px] font-semibold text-ink border-b border-hairline pb-3">Loan Dispatch</h2>

          <div>
            <label htmlFor="issue-barcode" className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
              Book Copy (Barcode) *
            </label>
            <select
              id="issue-barcode"
              className="input-field"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              required
            >
              <option value="">Select an available copy…</option>
              {availableCopies.map((c) => (
                <option key={c.id} value={c.barcode}>
                  {c.barcode} — {c.book.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="issue-member" className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
              Member *
            </label>
            <select
              id="issue-member"
              className="input-field"
              value={membershipNumber}
              onChange={(e) => setMembershipNumber(e.target.value)}
              required
            >
              <option value="">Select a member…</option>
              {members.map((m) => (
                <option key={m.id} value={m.membershipNumber}>
                  {m.membershipNumber} — {m.name} ({m.memberType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="issue-days" className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
              Loan Period (Days)
            </label>
            <input
              id="issue-days"
              type="number"
              min="1"
              max="90"
              className="input-field"
              value={loanDays}
              onChange={(e) => setLoanDays(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={submitting || !barcode || !membershipNumber}
              id="issue-submit-btn"
            >
              {submitting ? <Spinner size="sm" /> : null}
              {submitting ? 'Issuing…' : 'Confirm & Issue Book'}
            </button>
          </div>
        </form>

        {/* Available Copies Table Card */}
        <div className="card overflow-hidden !p-0 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
            <div>
              <h2 className="text-[16px] font-semibold text-ink">Available Copies</h2>
              <p className="text-[12px] text-mid-gray mt-0.5">Click a copy row to quick-select</p>
            </div>
            <span className="badge-soft">{availableCopies.length} Available</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-hairline bg-surface-alt text-[12px] uppercase tracking-[0.05em] text-mid-gray font-medium">
                  <th className="px-6 py-3">Barcode</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Shelf</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {availableCopies.map((c) => (
                  <tr
                    key={c.id}
                    className={`cursor-pointer transition-colors hover:bg-surface-alt ${
                      barcode === c.barcode ? 'bg-surface-alt font-medium' : ''
                    }`}
                    onClick={() => setBarcode(c.barcode)}
                  >
                    <td className="px-6 py-3.5 font-mono text-[13px] text-ink">{c.barcode}</td>
                    <td className="px-6 py-3.5 text-ink">{c.book.title}</td>
                    <td className="px-6 py-3.5 text-mid-gray">{c.shelfLocation || '—'}</td>
                    <td className="px-6 py-3.5">
                      <span className="badge-soft">Available</span>
                    </td>
                  </tr>
                ))}
                {availableCopies.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-mid-gray">No copies available currently</td>
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
