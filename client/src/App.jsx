import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import Dashboard from './pages/Dashboard';
import IssuePage from './pages/IssuePage';
import ReturnPage from './pages/ReturnPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-canvas text-ink font-sans transition-colors duration-200">
        <Sidebar />
        <div className="ml-64 flex-1 flex flex-col min-w-0">
          {/* Top Bar with Theme Toggle at top right corner */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-hairline bg-surface-alt/80 px-8 backdrop-blur-md transition-colors duration-200">
            <div className="flex items-center gap-2 text-[13px] text-mid-gray">
              <span className="font-semibold text-ink">LibraFlow</span>
              <span className="text-mid-gray/50">/</span>
              <span>LMS Studio</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 px-8 py-8 max-w-[1280px] w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/issue" element={<IssuePage />} />
              <Route path="/return" element={<ReturnPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
