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
      black: '#06080F',
      white: '#FFFFFF',
      dark: '#141721',
      yellow: '#F9FF73',
      green: '#A9DC76',
      pink: '#FF6188',
      blue: '#78DCE8',

      grey: {
        DEFAULT: '#9D9E91',
        light: '#F0F2DA',
        lightBg: '#313442',
        dark: '#1E212B',
      },
    },

    fontFamily: {
      heading: ['Cabinet Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      content: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },

    container: {
      width: '90%',
      center: true,
      screens: {
        lg: '1320px',
      },
      padding: {
        DEFAULT: '2rem',
      },
    },

    extend: {
      backgroundImage: {
        gradientDark: 'linear-gradient(180deg, #06080F 0%, rgba(6, 8, 15, 0) 100%)',
        gradientDarkReverse: 'linear-gradient(180deg, rgba(6, 8, 15, 0) 0%, #06080F 100%)',
      },
      borderWidth: {
        1: '1px',
        3: '3px',
      },
      boxShadow: {
        black: '0px 2px 4px rgba(0, 0, 0, 0.12)',
      },
      gridTemplateColumns: {
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
