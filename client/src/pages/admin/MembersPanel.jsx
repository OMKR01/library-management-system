import { useEffect, useState } from 'react';
import { fetchAllMembers, createMember, updateMember, deleteMember } from '../../api/client';
import Spinner from '../../components/Spinner';
import Toast from '../../components/Toast';

export default function MembersPanel() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [form, setForm] = useState({
    membershipNumber: '',
    name: '',
    email: '',
    phone: '',
    memberType: 'STANDARD',
    maxAllowed: '3',
  });

  const loadData = () => {
    setLoading(true);
    fetchAllMembers()
      .then(setMembers)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setForm({
      membershipNumber: '',
      name: '',
      email: '',
      phone: '',
      memberType: 'STANDARD',
      maxAllowed: '3',
    });
    setEditingMember(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        const { membershipNumber, ...updateData } = form;
        await updateMember(editingMember.id, updateData);
        setToast({ message: 'Member updated successfully', type: 'success' });
      } else {
        await createMember(form);
        setToast({ message: 'Member created successfully', type: 'success' });
      }
      resetForm();
      loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleEdit = (member) => {
    setForm({
      membershipNumber: member.membershipNumber,
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      memberType: member.memberType,
      maxAllowed: String(member.maxAllowed),
    });
    setEditingMember(member);
    setShowForm(true);
  };

  const handleToggleActive = async (member) => {
    try {
      await updateMember(member.id, { isActive: !member.isActive });
      setToast({
        message: `Member ${member.isActive ? 'deactivated' : 'activated'}`,
        type: 'success',
      });
      loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await deleteMember(id);
      setToast({ message: 'Member deleted', type: 'success' });
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
        onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}
        className="btn-primary"
        id="add-member-btn"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {showForm && !editingMember ? 'Close Form' : 'Add New Member'}
      </button>

      {/* Member Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4" id="member-form">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-[16px] font-semibold text-ink">
              {editingMember ? 'Edit Member Profile' : 'Enroll New Member'}
            </h3>
            <span className="text-[12px] text-mid-gray">All fields marked * are required</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Membership # *
              </label>
              <input
                className="input-field"
                value={form.membershipNumber}
                onChange={(e) => setForm({ ...form, membershipNumber: e.target.value })}
                required
                disabled={!!editingMember}
                placeholder="e.g. MEM-004"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Full Name *
              </label>
              <input
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g. Eleanor Vance"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Email Address *
              </label>
              <input
                className="input-field"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="e.g. eleanor@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Phone Number
              </label>
              <input
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 555-0104"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Member Classification
              </label>
              <select
                className="input-field"
                value={form.memberType}
                onChange={(e) => setForm({ ...form, memberType: e.target.value })}
              >
                <option value="STANDARD">Standard</option>
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray">
                Max Concurrent Loans
              </label>
              <input
                className="input-field"
                type="number"
                min="1"
                max="20"
                value={form.maxAllowed}
                onChange={(e) => setForm({ ...form, maxAllowed: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              {editingMember ? 'Update Member' : 'Enroll Member'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Members Directory Card */}
      <div className="card overflow-hidden !p-0">
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <div>
            <h2 className="text-[16px] font-semibold text-ink">Member Roster</h2>
            <p className="text-[12px] text-mid-gray mt-0.5">
              {members.length} registered patron{members.length !== 1 ? 's' : ''}
            </p>
          </div>
          <span className="badge-soft">{members.length} Patrons</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-hairline bg-surface-alt text-[12px] uppercase tracking-[0.05em] text-mid-gray font-medium">
                <th className="px-6 py-3">Member ID</th>
                <th className="px-6 py-3">Full Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Active Loans</th>
                <th className="px-6 py-3">Account Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {members.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-surface-alt">
                  <td className="px-6 py-3.5 font-mono text-[13px] text-ink">{m.membershipNumber}</td>
                  <td className="px-6 py-3.5 font-medium text-ink">{m.name}</td>
                  <td className="px-6 py-3.5 text-mid-gray">{m.email}</td>
                  <td className="px-6 py-3.5">
                    <span className="badge-soft">{m.memberType}</span>
                  </td>
                  <td className="px-6 py-3.5 text-mid-gray">{m.borrowRecords?.length || 0} active</td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => handleToggleActive(m)}
                      className={`cursor-pointer transition-opacity hover:opacity-80 ${
                        m.isActive ? 'badge-soft text-ink' : 'badge-destructive'
                      }`}
                      title="Click to toggle status"
                    >
                      {m.isActive ? 'Active' : 'Suspended'}
                    </button>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(m)}
                        className="rounded-[18px] p-1.5 text-mid-gray transition-colors hover:bg-canvas hover:text-ink"
                        title="Edit Member"
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
                        onClick={() => handleDelete(m.id)}
                        className="rounded-[18px] p-1.5 text-mid-gray transition-colors hover:bg-red-50 hover:text-ember"
                        title="Delete Member"
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
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-mid-gray">
                    No members enrolled
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
