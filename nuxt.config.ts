import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { getAppConfig } from './lib/utils';

const env = process.env.ENV || process.env.RUN_ENV || process.env.NODE_ENV;
const appConfig: ConfigInterface = getAppConfig(env);

const meta = {
  lang: 'en',
  title: 'Apillon - Build Web3 products. Easily.',
  description:
    'Apillon is a Web3 development platform empowering developers to build in the Polkadot ecosystem.',
  url: appConfig.url,
  image: `${appConfig.url}/register-now.jpg`,
  twitter: '@apillon_io',
};

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,

  typescript: { shim: false },

  nitro: {
    plugins: ['~/lib/nitro-globals'],
  },

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
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'nuxt-icons',
    [
      '@nuxtjs/google-fonts',
      {
        useStylesheet: true,
        display: 'swap',
        download: false,
        families: {
          'IBM Plex Mono': {
            wght: [400, 700],
          },
          'IBM Plex Sans': {
            wght: [400, 700],
          },
        },
      },
    ],
    '@nuxtjs/i18n',
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

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },

  imports: {
    dirs: [
      './lib',
      './lib/wallet',
      './types',
      './stores',
      './stores/hosting',
      './stores/nft',
      './stores/storage',
    ],
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

      script: [
        {
          children:
            env === 'production'
              ? `var _mtm = window._mtm = window._mtm || [];
          _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src='https://analytics.apillon.io/js/container_UpKxUE2a.js'; s.parentNode.insertBefore(g,s);`
              : '',
        },
        {
          children:
            env === 'production'
              ? `var _paq = (window._paq = window._paq || []);
            /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function () {
              const u = '//analytics.apillon.io/';
              _paq.push(['setTrackerUrl', u + 'matomo.php']);
              _paq.push(['setSiteId', '2']);
              const d = document;
              const g = d.createElement('script');
              const s = d.getElementsByTagName('script')[0];
              g.async = true;
              g.src = u + 'matomo.js';
              s.parentNode.insertBefore(g, s);
            })();`
              : '',
        },
      ],
    },
  },

  i18n: {
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
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
});
