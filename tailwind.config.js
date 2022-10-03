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
      primary: '#7F5AF0',
      secondary: '#B62CA8',

      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',
      dark: '#010101',
      red: '#B62C2C',
      green: '#2CB67D',
      olive: '#B3B62C',
      orange: '#B6552C',
      fireBrick: '#B6552C',
      turquoise: '#2C95B6',
      blue: '#2C3AB6',

      grey: {
        DEFAULT: '#94A1B2',
        lightest: '#FAF8F5',
        lighter: '#DCDCDC',
        light: '#94A1B2',
        bright: '#6A7380',
        dark: '#242629',
        darker: '#010101',
      },

      purple: {
        DEFAULT: '#7F5AF0',
        dark: '#5E43B2',
        light: '#A48BF0',
        lightest: '#F4F1FE',
      },

      pink: {
        DEFAULT: '#B62CA8',
        dark: '#821F78',
        light: '#B62CA8',
      },
    },

    fontFamily: {
      heading: ['Epilogue', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      content: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
      colors: {
        purple: {
          500: '#A48BF0',
          750: '#7F5AF0',
          900: '#5E43B2',
        },
        pink: {
          DEFAULT: '#B62CA8',
          dark: '#821F78',
          light: '#B62CA8',
        },
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
