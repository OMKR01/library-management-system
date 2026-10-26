import { NavLink } from 'react-router-dom';

const circulationLinks = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    to: '/issue',
    label: 'Issue Book',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    to: '/return',
    label: 'Return Book',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
      </svg>
    ),
  },
];

const adminLink = {
  to: '/admin',
  label: 'Admin Panel',
  icon: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-hairline bg-surface-alt transition-colors duration-200">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-hairline px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-ink text-canvas transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <div>
          <h1 className="text-[14px] font-semibold tracking-tight text-ink">LibraFlow</h1>
          <p className="text-[11px] font-medium tracking-wide text-mid-gray uppercase">LMS Studio</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 space-y-1 px-3">
        <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.05em] text-mid-gray">Circulation</p>
        {circulationLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-[18px] px-3.5 py-2 text-[14px] font-medium transition-colors ${
                isActive
                  ? 'bg-ink text-canvas shadow-sm'
                  : 'text-mid-gray hover:bg-canvas hover:text-ink'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}

        <div className="my-5 border-t border-hairline" />

        <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.05em] text-mid-gray">Administration</p>
        <NavLink
          to={adminLink.to}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-[18px] px-3.5 py-2 text-[14px] font-medium transition-colors ${
              isActive
                ? 'bg-ink text-canvas shadow-sm'
                : 'text-mid-gray hover:bg-canvas hover:text-ink'
            }`
          }
        >
          {adminLink.icon}
          {adminLink.label}
        </NavLink>
      </nav>

      {/* Footer Info */}
      <div className="border-t border-hairline p-4">
        <div className="rounded-[10px] bg-canvas p-3 border border-hairline transition-colors">
          <p className="text-[12px] font-medium text-ink">Library Core</p>
          <p className="text-[11px] text-mid-gray">Achromatic Design • SQLite</p>
        </div>
      </div>
    </aside>
  );
}
