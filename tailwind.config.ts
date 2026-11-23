import type { Config } from 'tailwindcss';

/** Color from a CSS variable, with support for Tailwind's /opacity modifiers. */
const c = (v: string) => `color-mix(in srgb, var(${v}) calc(<alpha-value> * 100%), transparent)`;

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Every color resolves to a CSS variable defined in app/globals.css (:root), so the whole
      // theme can be re-tuned there. `c()` keeps Tailwind opacity modifiers (e.g. text-ink/60) working.
      colors: {
        ink: c('--text-heading'), // headings and primary text (ivory on dark)
        paper: c('--bg-surface'), // raised surfaces: cards, panels, drawers
        line: c('--border-strong'),
        mineral: {
          DEFAULT: c('--bg-primary'), // page background
          100: c('--bg-surface'),
          200: c('--bg-elevated'),
          300: c('--bg-elevated-2'),
        },
        surface: c('--bg-surface'),
        elevated: c('--bg-elevated'),
        stone: {
          DEFAULT: c('--text-heading'),
          700: c('--text-body'),
          500: c('--text-muted'),
          400: c('--text-subtle'),
        },
        forest: {
          DEFAULT: c('--bg-sunken'),
          800: c('--bg-surface'),
          700: c('--bg-elevated'),
          600: c('--bg-elevated-2'),
        },
        kiln: c('--bg-sunken'),
        sage: {
          DEFAULT: c('--accent-sage'),
          dark: c('--accent-sage'),
          light: c('--accent-sage-light'),
          pale: c('--bg-elevated'),
          mist: c('--bg-surface'),
        },
        accent: {
          DEFAULT: c('--accent-blue'),
          hover: c('--accent-blue-hover'),
          light: c('--accent-blue-light'),
        },
        // Legacy name for the accent, kept so existing classes follow the blue theme.
        iris: {
          DEFAULT: c('--accent-blue-light'),
          light: c('--accent-blue-soft'),
          pale: c('--accent-blue-tint'),
        },
      },
      fontFamily: {
        display: ['var(--font-heading)'],
        sans: ['var(--font-body)'],
        serif: ['var(--font-accent)'],
      },
      borderRadius: {
        media: '10px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,.3), 0 12px 30px -18px rgba(0,0,0,.6)',
        lift: '0 2px 6px rgba(0,0,0,.35), 0 30px 60px -30px rgba(0,0,0,.75)',
        float: '0 50px 90px -40px rgba(0,0,0,.85), 0 20px 36px -20px rgba(0,0,0,.6)',
        glass: '0 40px 80px -30px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.06)',
        glow: '0 10px 30px -10px var(--accent-blue-glow)',
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
