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
      black: '#000000',
      white: '#FFFFFF',
      dark: '#141721',
      yellow: '#F9FF73',
      green: '#A9DC76',
      pink: '#FF6188',
      blue: '#78DCE8',

      grey: {
        DEFAULT: '#9D9E91',
        light: '#F0F2DA',
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
        xl: '1480px',
      },
      padding: {
        DEFAULT: '2rem',
      },
    },

    extend: {
      background: {
        'pink-purple': 'linear-gradient(242.78deg, #7F5AF0 -0.94%, #B62CA8 66.98%)',
      },
      backgroundImage: {
        login: "url('/images/bg-login.png')",
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
