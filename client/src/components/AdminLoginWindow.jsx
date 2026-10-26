import { useState } from 'react';
import { adminLogin, saveAdminSession } from '../api/client';
import Spinner from './Spinner';

export default function AdminLoginWindow({ onLoginSuccess, onCancel }) {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await adminLogin({ adminId, password });
      saveAdminSession(data);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4 animate-fade-in">
      <div className="card w-full max-w-md p-8 shadow-subtle-lg">
        {/* Header with Lock Icon */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[18px] bg-ink text-canvas">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.75}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h2 className="text-[24px] font-semibold tracking-[-0.6px] text-ink">
            Admin Authorization
          </h2>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-5 rounded-[10px] border border-ember/30 bg-ember/10 p-3 text-[13px] font-medium text-ember flex items-center gap-2">
            <svg className="h-4 w-4 flex-shrink-0 text-ember" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" id="admin-login-form">
          <div>
            <label
              htmlFor="admin-id"
              className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray"
            >
              Administrator ID *
            </label>
            <input
              id="admin-id"
              type="text"
              className="input-field"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter ID"
              required
              autoFocus
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="admin-password"
                className="block text-[12px] font-medium uppercase tracking-[0.05em] text-mid-gray"
              >
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-mid-gray hover:text-ink transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={loading || !adminId || !password}
              className="btn-primary w-full"
              id="admin-login-submit"
            >
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Verifying Authorization…' : 'Authorize & Enter Admin Panel'}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary w-full"
              >
                Return to Dashboard
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
