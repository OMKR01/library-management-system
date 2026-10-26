export default function Spinner({ size = 'md' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-7 w-7' };
  return (
    <svg
      className={`animate-spin text-ink ${sizes[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
