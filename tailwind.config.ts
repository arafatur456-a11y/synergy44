import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        paper: '#FBF9F5',
        line: '#E3DCD1',
        cream: {
          DEFAULT: '#F5F1EA',
          100: '#EEE8DE',
          200: '#E4DCD0',
          300: '#D3C8B8',
        },
        espresso: {
          DEFAULT: '#111111',
          700: '#2B2824',
          500: '#57514A',
          400: '#776F65',
        },
        forest: {
          DEFAULT: '#131C18',
          800: '#18241F',
          700: '#22332B',
          600: '#2E463B',
        },
        sage: {
          DEFAULT: '#4A6B5D',
          dark: '#2F4A3E',
          light: '#8FA99B',
          pale: '#DCE5DF',
          mist: '#EDF1EC',
        },
        champagne: {
          DEFAULT: '#A27D42',
          light: '#D8BC84',
          pale: '#F1E6CF',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(17,17,17,.05), 0 14px 34px -18px rgba(17,17,17,.22)',
        lift: '0 2px 6px rgba(17,17,17,.06), 0 40px 70px -34px rgba(17,17,17,.42)',
        float: '0 60px 100px -40px rgba(10,16,13,.65), 0 24px 40px -20px rgba(10,16,13,.35)',
        glass: '0 50px 90px -30px rgba(8,12,10,.55), 0 18px 34px -16px rgba(8,12,10,.35), inset 0 1px 0 rgba(255,255,255,.75)',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        drift: 'drift 8s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
