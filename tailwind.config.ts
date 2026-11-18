import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF8F5',
          100: '#F4F0EA',
          200: '#ECE6DC',
          300: '#DDD4C6',
        },
        espresso: {
          DEFAULT: '#1E1D1B',
          700: '#3A3733',
          500: '#6B655D',
          400: '#8C857B',
        },
        sage: {
          DEFAULT: '#4A6B5D',
          dark: '#35503F',
          light: '#7E9A8C',
          pale: '#DCE5DF',
          mist: '#EEF2EE',
        },
        champagne: {
          DEFAULT: '#B8975E',
          light: '#E6D3AE',
          pale: '#F3EADB',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(30,29,27,.04), 0 12px 32px -14px rgba(30,29,27,.14)',
        lift: '0 2px 4px rgba(30,29,27,.04), 0 34px 64px -28px rgba(30,29,27,.28)',
        float: '0 50px 90px -40px rgba(53,80,63,.35), 0 18px 36px -18px rgba(30,29,27,.18)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        sheen: {
          '0%': { backgroundPosition: '0 0, 200% 0' },
          '100%': { backgroundPosition: '0 0, -200% 0' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        drift: 'drift 9s ease-in-out infinite',
        marquee: 'marquee 45s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
