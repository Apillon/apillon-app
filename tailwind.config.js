/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      hd: '1920px',
    },

    colors: {
      primary: '#F9FF73',
      secondary: '#78DCE8',

      transparent: 'transparent',
      current: 'currentColor',
      white: '#F0F2DA',
      yellow: '#F9FF73',
      orange: '#F7AF39',
      pink: '#FF6188',
      green: '#A9DC76',
      violet: '#AB9DF2',
      blue: '#78DCE8',

      body: '#9D9E91',
      bodyDark: '#6A6B63',

      bg: {
        lighter: '#313442',
        light: '#1E212B',
        DEFAULT: '#141721',
        dark: '#06080F',
      },

      /** Depricated color names - use body and bg colors instead */
      dark: '#141721',
      black: '#06080F',
      grey: {
        DEFAULT: '#9D9E91',
        light: '#F0F2DA',
        lightBg: '#313442',
        dark: '#1E212B',
      },
    },

    fontFamily: {
      sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['IBM Plex Mono', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },

    container: {
      center: true,
      screens: {
        lx: '1320px',
      },
      padding: {
        DEFAULT: '1rem',
      },
    },

    extend: {
      backgroundImage: {
        gradientDark: 'linear-gradient(180deg, #06080F 0%, rgba(6, 8, 15, 0) 100%)',
        gradientDarkReverse: 'linear-gradient(180deg, rgba(6, 8, 15, 0) 0%, #06080F 100%)',
        w3Warn:
          'linear-gradient(180deg, #F9FF73 0%, #78DCE8 20.31%, #F7AF39 39.58%, #FF6188 59.37%, #A9DC76 79.17%, #AB9DF2 100%)',
      },
      borderWidth: {
        1: '1px',
        3: '3px',
      },
      boxShadow: {
        black: '0px 2px 4px rgba(0, 0, 0, 0.12)',
        light: '0px 0px 4px rgba(240, 242, 218, 0.64)',
      },
      gridTemplateColumns: {
        billing: 'repeat(auto-fill, minmax(310px, 1fr))',
        services: 'repeat(auto-fit, minmax(280px, 1fr))',
      },
      zIndex: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
      },
    },
  },

  content: [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `composables/**/*.{js,ts}`,
    `plugins/**/*.{js,ts}`,
    `App.{js,ts,vue}`,
    `app.{js,ts,vue}`,
  ],

  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
