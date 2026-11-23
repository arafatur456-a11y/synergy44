import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // "Thin film" palette: mineral base, rosemary ink, one violet accent drawn from the glass.
      // The dichroic spectrum (teal → iris → amber) is reserved for glass and the hero rim.
      colors: {
        ink: '#1E2D27', // rosemary — text and dark surfaces
        paper: '#FAFAF7',
        line: '#D5D9D2',
        mineral: {
          DEFAULT: '#EFF0EB', // page base
          100: '#E6E8E2',
          200: '#DADDD5',
          300: '#C8CCC3',
        },
        stone: {
          DEFAULT: '#1E2D27',
          700: '#33403A',
          500: '#5A645F',
          400: '#78807B',
        },
        forest: {
          DEFAULT: '#16201C',
          800: '#1B2621',
          700: '#24322B',
          600: '#2F4038',
        },
        kiln: '#141418', // dark field the glass is shown on
        sage: {
          DEFAULT: '#557565',
          dark: '#3A5A4B',
          light: '#93AC9F',
          pale: '#DCE4DE',
          mist: '#E9EEEA',
        },
        iris: {
          DEFAULT: '#5B4BC4',
          light: '#B4A9EE',
          pale: '#E6E2F8',
        },
        film: {
          teal: '#2FA6A0',
          iris: '#6E5BD0',
          amber: '#E2A13B',
        },
      },
      fontFamily: {
        display: ['var(--font-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        sans: ['var(--font-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      borderRadius: {
        media: '10px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(30,45,39,.06), 0 12px 30px -18px rgba(30,45,39,.25)',
        lift: '0 2px 6px rgba(30,45,39,.06), 0 30px 60px -32px rgba(30,45,39,.45)',
        float: '0 50px 90px -40px rgba(14,22,19,.6), 0 20px 36px -20px rgba(14,22,19,.3)',
        glass: '0 40px 80px -30px rgba(14,22,19,.5), inset 0 1px 0 rgba(255,255,255,.7)',
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
