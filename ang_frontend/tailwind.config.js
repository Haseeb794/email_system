module.exports = {
  content: ['./src/**/*.{html,ts}'],

  // Safelist dynamic classes used in [ngClass] bindings that Tailwind can't
  // statically scan (e.g. conditionally built strings in the template).
  safelist: [
    'bg-app-success',
    'bg-app-error',
    'bg-app-surface',
    'text-app-success',
    'text-app-error',
    'text-app-gold',
    'text-app-muted',
    'text-app-ink',
    'border-app-success',
    'border-app-error',
    'border-app-border',
    'border-app-gold',
    'shadow-[0_0_8px_#52c98c]',
    'shadow-[0_0_8px_#f97066]',
    'bg-[rgba(82,201,140,0.08)]',
    'border-[rgba(82,201,140,0.3)]',
    'bg-[rgba(249,112,102,0.08)]',
    'border-[rgba(249,112,102,0.3)]',
    'bg-[rgba(82,201,140,0.1)]',
    'border-[rgba(82,201,140,0.2)]',
    'bg-[rgba(249,112,102,0.1)]',
    'border-[rgba(249,112,102,0.2)]',
    'bg-[rgba(232,201,126,0.25)]',
    'border-[rgba(232,201,126,0.25)]',
  ],

  theme: {
    extend: {
      colors: {
        // Prefixed with "app-" to avoid colliding with Tailwind built-ins
        // ("border", "bg", "muted" are all reserved or ambiguous in Tailwind v3).
        'app-bg': '#0d0d14',
        'app-surface': '#13131f',
        'app-border': '#1e1e30',
        'app-gold': '#e8c97e',
        'app-muted': '#6e6e8a',
        'app-ink': '#e8e4dc',
        'app-error': '#f97066',
        'app-success': '#52c98c',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      keyframes: {
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to: { opacity: '1', transform: 'none' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'none' },
        },
        shimmer: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(100%)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        slideDown: 'slideDown 0.6s ease both',
        fadeUp: 'fadeUp 0.7s ease both',
        fadeUpDelay1: 'fadeUp 0.7s 0.1s ease both',
        fadeUpDelay2: 'fadeUp 0.7s 0.2s ease both',
        fadeUpFast: 'fadeUp 0.4s ease both',
        fadeUpToast: 'fadeUp 0.3s ease both',
        shimmer: 'shimmer 1s infinite',
        pulse2: 'pulse2 2s infinite',
      },
    },
  },
};
