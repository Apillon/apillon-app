import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: {
      en: en as DefaultLocaleMessageSchema,
      fr: fr as DefaultLocaleMessageSchema,
    },
  });

  vueApp.use(i18n);
});
