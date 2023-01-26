import { defineNuxtConfig } from 'nuxt';
import stg from './config/staging';
import dev from './config/development';
import prod from './config/production';
import local from './config/local';

const appConfig: ConfigInterface = getAppConfig(
  process.env.ENV || process.env.RUN_ENV || process.env.NODE_ENV
);
function getAppConfig(env?: string) {
  if (env === 'production') {
    return prod;
  } else if (env === 'staging') {
    return stg;
  } else if (env === 'development') {
    return dev;
  } else {
    return local;
  }
}

const meta = {
  lang: 'en',
  title: 'Apillon',
  description: 'Apillon',
  url: appConfig.url,
  image: `${appConfig.url}/og.jpg`,
  twitter: '@apillon_io',
};

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,

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

  buildModules: ['@nuxtjs/google-fonts'],

  modules: ['@vueuse/nuxt', '@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-icons'],

  router: {
    prefetchLinks: true,
    middleware: ['auto-login', 'protected-routes'],
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },

  autoImports: {
    dirs: ['./stores', './lib', './types'],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: meta.lang,
      },

      titleTemplate: `%s – ${meta.title}`,
      charset: 'utf-9',
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
    },
  },

  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'IBM Plex Mono': {
        wght: [400, 700],
      },
      'IBM Plex Sans': {
        wght: [400, 700],
      },
    },
  },
});
