/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  corePlugins: {
    preflight: false,
  },
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './index.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0A0A0B',
        darkSurface: '#121214',
        darkBorder: 'rgba(255, 255, 255, 0.08)',
        darkText: '#F4F4F5',
        darkMuted: '#A1A1AA',
        accent: {
          DEFAULT: '#C6FF3D',
          glow: 'rgba(198, 255, 61, 0.25)',
          muted: 'rgba(198, 255, 61, 0.12)',
        },
        accentSecondary: {
          DEFAULT: '#7928CA',
          glow: 'rgba(121, 40, 202, 0.3)',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'Syne', 'sans-serif'],
        body: ['var(--font-body)', 'Manrope', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      letterSpacing: {
        tighterHead: '-0.04em',
        monoTracking: '0.12em',
      },
      lineHeight: {
        tightDisplay: '0.95',
      }
    },
  },
  plugins: [],
}
