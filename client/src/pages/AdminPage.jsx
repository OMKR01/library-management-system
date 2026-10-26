import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BooksPanel from './admin/BooksPanel';
import MembersPanel from './admin/MembersPanel';
import AuthorsPanel from './admin/AuthorsPanel';
import CategoriesPanel from './admin/CategoriesPanel';
import AdminLoginWindow from '../components/AdminLoginWindow';
import { getAdminSession, clearAdminSession } from '../api/client';

const tabs = [
  {
    key: 'books',
    label: 'Books & Copies',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    key: 'members',
    label: 'Members',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    key: 'authors',
    label: 'Authors',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    key: 'categories',
    label: 'Categories',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('books');
  const [session, setSession] = useState(() => getAdminSession());
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    setSession(null);
  };

  // If not authenticated, require Admin Login Window
  if (!session) {
    return (
      <AdminLoginWindow
        onLoginSuccess={(newSession) => setSession(newSession)}
        onCancel={() => navigate('/')}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Header with Authorization Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[30px] font-semibold leading-[1.2] tracking-[-0.75px] text-ink">
              Administration authorized
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-semibold text-ink">
              {session.admin?.name || 'Administrator'}
            </p>
            <p className="text-[11px] text-mid-gray font-mono">
              ID: {session.admin?.id || 'admin'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            id="admin-logout-btn"
            className="btn-secondary text-[13px] py-1.5 px-3.5"
            title="Log out of admin"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Log Out
          </button>
        </div>
      </div>

      {/* Pill Tabs */}
      <div className="inline-flex gap-1.5 rounded-[18px] border border-hairline bg-surface-alt p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-[18px] px-4 py-2 text-[14px] font-medium transition-all ${activeTab === tab.key
              ? 'bg-ink text-canvas shadow-sm'
              : 'text-mid-gray hover:bg-canvas hover:text-ink'
              }`}
            id={`admin-tab-${tab.key}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in pt-2">
        {activeTab === 'books' && <BooksPanel />}
        {activeTab === 'members' && <MembersPanel />}
        {activeTab === 'authors' && <AuthorsPanel />}
        {activeTab === 'categories' && <CategoriesPanel />}
      </div>
    </div>
  );
}
