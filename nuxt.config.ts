import { defineNuxtConfig } from 'nuxt';
import { getAppConfig } from './lib/utils';

const meta = {
  lang: 'en',
  title: 'Apillon',
  description: 'Apillon',
  url: getAppConfig().url,
  image: `${getAppConfig().url}/og.jpg`,
  twitter: '@authtrail',
};

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,

  runtimeConfig: {
    public: getAppConfig() as Record<string, any>,
  },

  components: [
    '~/components',
    '~/components/auth/',
    '~/components/general/',
    '~/components/parts/',
    '~/components/dashboard/',
  ],

  buildModules: ['@nuxtjs/google-fonts'],

  modules: ['@vueuse/nuxt', '@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-icons'],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },

  autoImports: {
    dirs: ['./stores', './lib'],
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
      'IBM Plex Sans': {
        wght: [400, 700],
      },
    },
  },
});
