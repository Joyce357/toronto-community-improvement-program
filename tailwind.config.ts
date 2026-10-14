import type { Config } from 'tailwindcss'

// ─── TCIP Design Tokens ──────────────────────────────────────────────────────
// Bright, card-driven, green-forward system (Stitch-inspired UI language).
// Hex values remain provisional until the official TCIP brand guide is supplied.
// Legacy token names (brand-navy, brand-cyan, brand-gold, sage, etc.) are kept as
// aliases so existing pages, admin screens, and forms continue to compile.

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── Core Light TCIP Palette (Client Approved) ─────────────────────
        'tcip-white':        '#FFFFFF', // 55–60% Primary surface
        'tcip-offwhite':     '#FAFAF7', // Warm off-white
        'tcip-cream':        '#F7F3EA', // Soft cream
        'tcip-stone':        '#F1F2EF', // Light stone
        'tcip-gray':         '#F5F6F7', // Soft gray
        'tcip-sage':         '#EDF5EF', // Pale sage
        'tcip-charcoal':     '#242424', // Charcoal typography & structural accents
        'tcip-black':        '#111111', // Deep black
        'tcip-green':        '#16A34A', // 8–12% TCIP green accents
        'tcip-green-dark':   '#15803D', // Deep green (hover / focus)
        'tcip-green-light':  '#22C55E', // Light green
        'tcip-red':          '#D72638', // 2–4% TCIP red micro-accents
        'tcip-red-dark':     '#B81D2D',
        'tcip-border':       '#E3E6E3', // Soft border
        'tcip-muted':        '#66706B', // Muted text

        // ─── Semantic Brand Mappings ──────────────────────────────────────
        'brand-white':       '#FFFFFF',
        'brand-offwhite':    '#FAFAF7',
        'brand-cream':       '#F7F3EA',
        'brand-stone':       '#F1F2EF',
        'brand-gray':        '#F5F6F7',
        'brand-sage':        '#EDF5EF',
        'brand-charcoal':    '#242424',
        'brand-black':       '#111111',
        'brand-navy':        '#242424', // Legacy alias → Charcoal
        'brand-navy-dark':   '#111111',
        'brand-navy-light':  '#242424',

        'brand-green':       '#16A34A',
        'brand-green-dark':  '#15803D',
        'brand-green-light': '#22C55E',
        'brand-emerald':     '#16A34A',
        'brand-emerald-dark':'#15803D',
        'brand-emerald-light':'#22C55E',
        'brand-leaf':        '#16A34A',

        'brand-red':         '#D72638',
        'brand-red-dark':    '#B81D2D',
        'brand-red-light':   '#E84A5A',
        'brand-gold':        '#16A34A', // Legacy alias → Green
        'brand-gold-dark':   '#15803D',
        'brand-gold-light':  '#22C55E',
        'brand-cyan':        '#16A34A',

        // Surfaces
        'brand-mint':        '#EDF5EF', // Soft pale sage tint
        'brand-mint-strong': '#DCFCE7',
        'brand-sky':         '#F5F6F7',
        'brand-warm-white':  '#FAFAF7',
        'brand-sage-section':'#EDF5EF',
        'section-sage':      '#EDF5EF',
        'page':              '#FAFAF7',

        // ─── Dark Mode Neutralized to Light Equivalents ───────────────────
        // Ensures any residual dark: utility class renders as clean light surfaces
        'dark-bg':           '#FFFFFF',
        'dark-surface':      '#FAFAF7',
        'dark-card':         '#FFFFFF',
        'dark-card-hover':   '#F7F3EA',
        'dark-border':       '#E3E6E3',
        'dark-border-soft':  '#E3E6E3',
        'dark-text-primary': '#242424',
        'dark-text-secondary':'#66706B',
        'dark-text-muted':   '#66706B',

        // ─── Text ─────────────────────────────────────────────────────────
        'text-primary':      '#242424', // Charcoal
        'text-secondary':    '#66706B', // Muted text
        'text-dark':         '#111111',
        'text-muted':        '#66706B',

        // ─── Stitch Design Tokens (Client Approved) ────────────────────────
        'surface':                 '#fcf9f8',
        'surface-dim':             '#dcd9d9',
        'surface-bright':          '#fcf9f8',
        'surface-container-lowest':'#ffffff',
        'surface-container-low':   '#f6f3f2',
        'surface-container':       '#f0eded',
        'surface-container-high':  '#eae7e7',
        'surface-container-highest':'#e4e2e1',
        'on-surface':              '#1b1c1c',
        'on-surface-variant':      '#3e4a3d',
        'inverse-surface':         '#303030',
        'inverse-on-surface':      '#f3f0ef',
        'outline':                 '#6e7b6c',
        'outline-variant':         '#bdcaba',
        'surface-tint':            '#006e2d',
        'primary':                 '#006b2c',
        'on-primary':              '#ffffff',
        'primary-container':       '#00873a',
        'on-primary-container':    '#f7fff2',
        'inverse-primary':         '#62df7d',
        'secondary':               '#006d30',
        'on-secondary':            '#ffffff',
        'secondary-container':     '#92f5a4',
        'on-secondary-container':  '#007233',
        'tertiary':                '#ba0627',
        'on-tertiary':             '#ffffff',
        'tertiary-container':      '#de2c3c',
        'on-tertiary-container':   '#fffbff',
        'tertiary-fixed':          '#ffdad8',
        'tertiary-fixed-dim':      '#ffb3b1',
        'on-tertiary-fixed':       '#410007',
        'on-tertiary-fixed-variant':'#92001b',
        'primary-fixed':           '#7ffc97',
        'primary-fixed-dim':       '#62df7d',
        'on-primary-fixed':        '#002109',
        'on-primary-fixed-variant':'#005320',
        'secondary-fixed':         '#95f8a7',
        'secondary-fixed-dim':     '#79db8d',
        'on-secondary-fixed':      '#00210a',
        'on-secondary-fixed-variant':'#005323',

        // ─── Borders & surfaces ───────────────────────────────────────────
        'border-soft':       '#E3E6E3',
        'warm-white':        '#FFFFFF',
        'surface-warm':      '#FAFAF7',
        'surface-soft':      '#F1F2EF',
        'surface-stone':     '#F1F2EF',
        'surface-cream':     '#F7F3EA',
        'surface-sage':      '#EDF5EF',
        'surface-gray':      '#F5F6F7',

        // ─── Accent tokens (legacy-compatible) ────────────────────────────
        'accent-green':       '#16A34A',
        'accent-red':         '#D72638',
        'accent-black':       '#171717',
        'accent-gold':        '#16A34A',
        'accent-emerald':     '#16A34A',
        'accent-navy':        '#171717',
        'accent-orange':      '#EA580C',
        'accent-lime':        '#22C55E',
        'accent-pink':        '#D72638',
        'accent-purple':      '#7C3AED',
        'accent-blue':        '#2563EB',
        'accent-teal':        '#0D9488',

        // ─── Backward-compatibility aliases ───────────────────────────────
        'green-900':          '#14532D',
        'green-800':          '#166534',
        'green-700':          '#15803D',
        'green-600':          '#16A34A',
        'green-400':          '#22C55E',
        'green-300':          '#DCFCE7',
        'green-200':          '#DCFCE7',
        'green-100':          '#ECFDF5',
        'forest':             '#171717',
        'forest-dark':        '#0F0F0F',
        'moss':               '#16A34A',
        'olive':              '#16A34A',
        'leaf':               '#16A34A',
        'sage':               '#F1F5F4',
        'soft-sage':          '#F1F5F4',
        'pale-sage':          '#ECFDF5',
        'light-sage':         '#F8FAF9',
        'trust-blue':         '#171717',
        'river-blue':         '#2563EB',
        'fresh-cyan':         '#16A34A',
        'soft-sky':           '#ECFDF5',
        'clean-white':        '#FFFFFF',
        'ink':                '#1E293B',
        'ink-muted':          '#475569',
        'ink-subtle':         '#16A34A',
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        'headline-lg': ['"Plus Jakarta Sans"', 'sans-serif'],
        'eyebrow-bold': ['"Plus Jakarta Sans"', 'sans-serif'],
        'display-xl': ['"Plus Jakarta Sans"', 'sans-serif'],
        'display-xl-mobile': ['"Plus Jakarta Sans"', 'sans-serif'],
        'label-md': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-sm': ['"Plus Jakarta Sans"', 'sans-serif'],
        'body-lg': ['"Plus Jakarta Sans"', 'sans-serif'],
        'label-sm': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-lg-mobile': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-md': ['"Plus Jakarta Sans"', 'sans-serif'],
        'body-md': ['"Plus Jakarta Sans"', 'sans-serif'],
        'body-sm': ['"Plus Jakarta Sans"', 'sans-serif'],
        'title-md': ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1.5' }],
        'sm':   ['0.875rem', { lineHeight: '1.6' }],
        'base': ['1rem',     { lineHeight: '1.7' }],
        'lg':   ['1.125rem', { lineHeight: '1.7' }],
        'xl':   ['1.25rem',  { lineHeight: '1.5' }],
        '2xl':  ['1.5rem',   { lineHeight: '1.3' }],
        '3xl':  ['1.875rem', { lineHeight: '1.2' }],
        '4xl':  ['2.25rem',  { lineHeight: '1.15' }],
        '5xl':  ['3rem',     { lineHeight: '1.08' }],
        '6xl':  ['3.75rem',  { lineHeight: '1.05' }],
        '7xl':  ['4.5rem',   { lineHeight: '1.0' }],
        // Stitch typography scale
        'display-xl':        ['3.5rem',   { lineHeight: '1.1',  letterSpacing: '-0.03em',  fontWeight: '800' }],
        'display-xl-mobile': ['2.25rem',  { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '800' }],
        'headline-lg':       ['2.5rem',   { lineHeight: '1.2',  letterSpacing: '-0.02em',  fontWeight: '700' }],
        'headline-lg-mobile':['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '700' }],
        'headline-md':       ['1.75rem',  { lineHeight: '1.3',  letterSpacing: '-0.015em', fontWeight: '700' }],
        'headline-sm':       ['1.25rem',  { lineHeight: '1.4',  letterSpacing: '-0.01em',  fontWeight: '600' }],
        'title-md':          ['1.125rem', { lineHeight: '1.4',  letterSpacing: '-0.005em', fontWeight: '600' }],
        'body-lg':           ['1.125rem', { lineHeight: '1.6',  letterSpacing: '0',        fontWeight: '400' }],
        'body-md':           ['1rem',     { lineHeight: '1.55', letterSpacing: '0',        fontWeight: '400' }],
        'body-sm':           ['0.875rem', { lineHeight: '1.5',  letterSpacing: '0.005em',  fontWeight: '400' }],
        'eyebrow-bold':      ['0.75rem',  { lineHeight: '1.2',  letterSpacing: '0.08em',   fontWeight: '800' }],
        'label-md':          ['0.875rem', { lineHeight: '1.2',  letterSpacing: '0.01em',   fontWeight: '600' }],
        'label-sm':          ['0.75rem',  { lineHeight: '1.2',  letterSpacing: '0.02em',   fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        // Stitch spacing tokens
        'margin-desktop': '3rem',
        'margin-mobile':  '1.25rem',
        'gutter':         '1.5rem',
        'gutter-desktop': '2rem',
        'gutter-mobile':  '1rem',
        'space-xs':       '0.25rem',
        'space-sm':       '0.5rem',
        'space-md':       '1rem',
        'space-lg':       '1.5rem',
        'space-xl':       '2.5rem',
        'space-2xl':      '4rem',
        'space-3xl':      '6rem',
      },
      maxWidth: {
        'container': '1280px',
        'prose-lg':  '72ch',
      },
      borderRadius: {
        'lg':  '0.5rem',   // 8px  — small controls
        'xl':  '0.75rem',  // 12px — buttons, inputs
        '2xl': '1rem',     // 16px — cards
        '3xl': '1.25rem',  // 20px — featured cards / hero image
      },
      boxShadow: {
        'card':       '0 2px 8px -2px rgba(30, 41, 59, 0.04), 0 1px 2px 0 rgba(30, 41, 59, 0.03)',
        'card-hover': '0 8px 24px -4px rgba(22, 163, 74, 0.10), 0 2px 6px -2px rgba(30, 41, 59, 0.05)',
        'elevated':   '0 8px 24px -4px rgba(22, 163, 74, 0.10)',
        'nav':        '0 1px 0 0 rgba(30, 41, 59, 0.05), 0 4px 12px -4px rgba(30, 41, 59, 0.04)',
        'xs':         '0 1px 2px 0 rgba(30, 41, 59, 0.05)',
        '2xs':        '0 1px 2px 0 rgba(30, 41, 59, 0.03)',
        'green':      '0 6px 16px -4px rgba(22, 163, 74, 0.35)',
        'red':        '0 4px 14px 0 rgba(215, 38, 56, 0.20)',
      },
      backgroundImage: {
        'gradient-hero':  'linear-gradient(180deg, #FFFFFF 0%, #F8FAF9 100%)',
        'gradient-cta':   'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
        'gradient-black': 'linear-gradient(135deg, #171717 0%, #262626 100%)',
        'gradient-navy':  'linear-gradient(135deg, #171717 0%, #262626 100%)',
        'gradient-green': 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
        'gradient-red':   'linear-gradient(135deg, #D72638 0%, #B81D2D 100%)',
        'gradient-soft':  'linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 100%)',
        'gradient-card':  'linear-gradient(180deg, transparent 45%, rgba(23,23,23,0.75) 100%)',
      },
      animation: {
        'fade-up':  'fadeUp 0.5s ease-out both',
        'fade-in':  'fadeIn 0.4s ease-out both',
        'slide-in': 'slideIn 0.4s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
