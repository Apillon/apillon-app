/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      hd: '1920px',
    },

    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',
      dark: '#070707',
      red: '#E96452',
      green: '#27B51A',
      blue: '#42C6FF',
      disabled: '#353530',

      grey: {
        DEFAULT: '#767676',
        light: '#141414',
        lighter: '#1A1B1A',
        lightest: '#353530',
        bright: '#AEAEAE',
        dark: '#0C0C0C',
        darker: '#080808',
      },

      gold: {
        DEFAULT: '#EEDA74',
        dark: '#F3CD7F',
        light: '#FFD887',

        // GradientFills
        'gradient-light': '#FFD887',
        'gradient-dark': '#825D0E',

        // GradientStrokes
        'stroke-light': '#FFF7E4',
        'stroke-dark': '#855F11',
      },
    },

    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      serif: ['Playfair Display', 'ui-serif'],
    },

    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
      },
    },

    extend: {
      zIndex: {
        1: 1,
        2: 2,
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
    `app.{js,ts,vue}`
  ],

  plugins: [],
}
