/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        paper: 'var(--color-paper)',
        'surface-alt': 'var(--color-surface-alt)',
        ink: 'var(--color-ink)',
        'ink-soft': 'var(--color-ink-soft)',
        'mid-gray': 'var(--color-mid-gray)',
        hairline: 'var(--color-hairline)',
        ember: 'var(--color-ember)',
      },
      borderRadius: {
        card: '24px',
        pill: '18px',
        nested: '10px',
        small: '6px',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        'subtle-lg': '0 0 0 1px var(--color-hairline), 0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.025em',
        wide_cap: '0.05em',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
