/** This is copy of Tailwind custom colors */
export const colors = {
  primary: '#F9FF73',
  secondary: '#78DCE8',

  transparent: 'transparent',
  current: 'currentColor',
  black: '#000000',
  yellow: '#F9FF73',
  orange: '#F7AF39',
  pink: '#FF6188',
  green: '#A9DC76',
  violet: '#AB9DF2',
  blue: '#78DCE8',
  discord: '#4554E9',

  body: '#9D9E91',
  bodyDark: '#6A6B63',
  disabled: '#999',
  hover: '#999',
  placeholder: '#B6B6AF',

  white: {
    DEFAULT: '#F5F5EE',
    primary: '#F0F2DA',
    secondary: '#D5D7C1',
    terciary: '#B6B6AF',
  },

  bg: {
    lightest: '#F4F4EA',
    lighter: '#313442',
    light: '#1E212B',
    DEFAULT: '#141721',
    dark: '#06080F',
  },
};

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  theme: {
    screens: {
      mobile: { max: '767px' },
      tablet: { max: '1023px' },
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      xxl: '1680px',
      hd: '1920px',
    },

    colors: colors,

    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
          'linear-gradient(260deg, #F9FF73 0%, #78DCE8 20.31%, #F7AF39 39.58%, #FF6188 59.37%, #A9DC76 79.17%, #AB9DF2 100%)',
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
        billing: 'repeat(auto-fill, minmax(23rem, 1fr))',
        services: 'repeat(auto-fit, minmax(280px, 1fr))',
        nft: 'repeat(auto-fill, minmax(220px, 1fr))',
        nftSmall: 'repeat(auto-fill, minmax(120px, 1fr))',
        assetHub: 'minmax(320px, 580px) minmax(80px, 420px)',
        fit200: 'repeat(auto-fit, minmax(200px,1fr))',
        fill100: 'repeat(auto-fill, minmax(100px, 1fr))',
      },
      minHeight: {
        17: '4.25rem',
        18: '4.5rem',
      },
      height: {
        17: '4.25rem',
        18: '4.5rem',
      },
      padding: {
        22: '5.5rem',
      },
      scale: {
        10: '0.1',
        20: '0.2',
        30: '0.3',
        40: '0.4',
        60: '0.6',
        70: '0.7',
        80: '0.8',
        90: '0.9',
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
