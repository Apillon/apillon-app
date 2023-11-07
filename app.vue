<template>
  <div id="app" class="bg-bg">
    <n-config-provider
      :theme="theme"
      :theme-overrides="themeOverrides"
      :locale="locale"
      :date-locale="dateLocale"
    >
      <n-message-provider
        placement="bottom-right"
        :keep-alive-on-hover="true"
        :duration="3000"
        closable
      >
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </n-message-provider>
      <CookieConsent />
    </n-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { lightTheme, darkTheme, enUS, dateEnUS } from 'naive-ui';

const $i18n = useI18n();
window.$i18n = $i18n;

const lang = computed(() => {
  return $i18n.locale.value;
});
const locale = computed(() => {
  switch ($i18n.locale.value) {
    case 'en':
      return enUS;
    default:
      return enUS;
  }
});
const dateLocale = computed(() => {
  switch ($i18n.locale.value) {
    case 'en':
      return dateEnUS;
    default:
      return dateEnUS;
  }
});

/**  Theme switcher dark/light mode
const prefersTheme =
  localStorage.getItem('theme') === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme:dark)').matches);
  */
const prefersDarkTheme = true;
const themeName = prefersDarkTheme ? 'dark' : 'light';
localStorage.setItem('theme', themeName);

const theme = computed(() => {
  return prefersDarkTheme ? darkTheme : lightTheme;
});

useHead({
  htmlAttrs: {
    class: themeName,
    lang,
  },
});
</script>
