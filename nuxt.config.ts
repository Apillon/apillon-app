import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { getAppConfig } from './lib/utils';

const env = process.env.ENV || process.env.RUN_ENV || process.env.NODE_ENV;
const appConfig: ConfigInterface = getAppConfig(env);

const meta = {
  lang: 'en',
  title: 'Apillon - Web3 development platform.',
  description: 'Robust infrastructure for developers. Few-click solutions for everyone else.',
  url: appConfig.url,
  image: `${appConfig.url}/apillon_og.jpg`,
  twitter: '@apillon_io',
};

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  typescript: { shim: false },

  runtimeConfig: {
    public: appConfig,
  },

  components: [
    '~/components',
    '~/components/general/',
    '~/components/parts/',
    '~/components/dashboard/',
  ],

  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'nuxt-icons',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    ['@nuxtjs/tailwindcss', { cssPath: '~/assets/css/tailwind.css' }],
  ],

  vite: {
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': ['useMessage'],
          },
        ],
      }),

      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],

    optimizeDeps: {
      include: process.env.NODE_ENV === 'development' ? ['naive-ui'] : [],
    },
  },

  imports: {
    dirs: ['composables/', 'composables/stores/**', 'lib/**'],
  },

  nitro: {
    compressPublicAssets: true,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: meta.lang,
      },

      title: meta.title,
      titleTemplate: `%s - ${meta.title}`,
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',

      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#070707' },
        { name: 'description', content: meta.description, hid: 'description' },
        { name: 'og:title', content: meta.title, hid: 'og:title' },
        { name: 'og:description', content: meta.description, hid: 'og:description' },
        { name: 'og:url', content: meta.url, hid: 'og:url' },
        { name: 'og:image', content: meta.image },
        { name: 'og:type', content: 'website' },
        { name: 'twitter:title', content: meta.title, hid: 'twitter:title' },
        { name: 'twitter:description', content: meta.description, hid: 'twitter:description' },
        { name: 'twitter:url', content: meta.url, hid: 'twitter:url' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: meta.image },
        { name: 'twitter:creator', content: meta.twitter },
        { name: 'twitter:site', content: meta.twitter },
      ],

      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'manifest', href: '/manifest.json' },
      ],

      script: [],
    },
  },

  i18n: {
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    compilation: { strictMessage: false, escapeHtml: false },
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      redirectOn: 'root',
    },
  },

  googleFonts: {
    useStylesheet: true,
    display: 'swap',
    download: true,
    families: {
      Inter: {
        wght: [400, 700],
      },
    },
  },

  compatibilityDate: '2024-08-29',
});