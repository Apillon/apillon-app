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

  components: ['~/components', '~/components/general/', '~/components/parts/', '~/components/dashboard/'],

  modules: [
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@wagmi/vue/nuxt',
    'nuxt-icons',
    'pinia-plugin-persistedstate/nuxt',
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
      {
        name: 'vite-plugin-glob-transform',
        transform(code: string, id: string) {
          if (id.includes('nuxt-icons')) {
            return code.replace(/as:\s*['"]raw['"]/g, 'query: "?raw", import: "default"');
          }
          return code;
        },
      },
    ],

    optimizeDeps: {
      include: process.env.NODE_ENV === 'development' ? ['naive-ui'] : [],
      exclude:
        process.env.NODE_ENV === 'development'
          ? [
              'uuid',
              'viem/chains',
              'swiper/vue',
              'swiper/modules',
              '@subsocial/grill-widget',
              '@wdns/vue-code-block',
              'vue3-youtube',
              'swiper/types',
              'seemly',
            ]
          : [],
    },
  },

  imports: {
    dirs: ['composables/', 'stores/**', 'lib/types', 'lib/utils', 'lib/values'],
  },

  nitro: {
    compressPublicAssets: true,
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'no-referrer',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        },
      },
    },
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
        { name: 'description', content: meta.description },
        { name: 'og:title', content: meta.title },
        { name: 'og:description', content: meta.description },
        { name: 'og:url', content: meta.url },
        { name: 'og:image', content: meta.image },
        { name: 'og:type', content: 'website' },
        { name: 'twitter:title', content: meta.title },
        { name: 'twitter:description', content: meta.description },
        { name: 'twitter:url', content: meta.url },
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
    langDir: '',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    bundle: { optimizeTranslationDirective: false },
    compilation: { strictMessage: false, escapeHtml: false },
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en/index.ts',
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

  compatibilityDate: '2025-04-07',
});
