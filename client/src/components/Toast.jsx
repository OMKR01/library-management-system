import { useState } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const [exiting, setExiting] = useState(false);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 200);
  };

  const isError = type === 'error';

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-[18px] border bg-paper px-4 py-3 shadow-subtle-lg transition-all duration-200 ${
        isError ? 'border-ember text-ember' : 'border-hairline text-ink'
      } ${exiting ? 'translate-y-[-10px] opacity-0' : 'animate-slide-down'}`}
    >
      {isError ? (
        <svg className="h-4 w-4 flex-shrink-0 text-ember" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      ) : (
        <svg className="h-4 w-4 flex-shrink-0 text-ink" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <p className="text-[14px] font-medium text-ink">{message}</p>
      <button
        onClick={handleClose}
        className="ml-2 rounded-[18px] p-1 text-mid-gray transition-colors hover:bg-canvas hover:text-ink"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
