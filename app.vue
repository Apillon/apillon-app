<template>
  <div id="app" class="bg-white dark:bg-black">
    <n-config-provider
      :theme="theme"
      :theme-overrides="themeOverrides"
      :locale="locale"
      :date-locale="dateLocale"
    >
      <NuxtLayout>
        <NuxtPage />
        <!-- <CookieConsent /> -->
        <portal-target :name="Portals.LAYOUT" multiple />
      </NuxtLayout>
    </n-config-provider>
  </div>
</template>

<script lang="ts" setup>
import {
  GlobalThemeOverrides,
  NConfigProvider,
  lightTheme,
  darkTheme,
  enUS,
  dateEnUS,
  frFR,
  dateFrFR,
} from 'naive-ui';
import { useI18n } from 'vue-i18n';
import colors from './tailwind.colors';

const $i18n = useI18n();
const lang = computed(() => {
  return $i18n.locale.value;
});
const locale = computed(() => {
  switch ($i18n.locale.value) {
    case 'en':
      return enUS;
    case 'fr':
      return frFR;
    default:
      return enUS;
  }
});
const dateLocale = computed(() => {
  switch ($i18n.locale.value) {
    case 'en':
      return dateEnUS;
    case 'fr':
      return dateFrFR;
    default:
      return dateEnUS;
  }
});

// Dark mode
const prefersDarkMode =
  localStorage.getItem('theme') === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme:dark)').matches);
const themeName = prefersDarkMode ? 'dark' : 'light';
localStorage.setItem('theme', themeName);

const theme = computed(() => {
  return prefersDarkMode ? darkTheme : lightTheme;
});

useHead({
  htmlAttrs: {
    class: themeName,
    lang,
  },
});

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: colors.primary,
  },
  Button: {
    fontSizeMedium: '16px',
    fontWeight: 'bold',
    heightLarge: '68px',
    heightMedium: '56px',
    heightSmall: '36px',
    borderPrimary: `1px solid ${colors.purple.DEFAULT}`,
    borderFocusPrimary: `1px solid ${colors.purple.light}`,
    borderHoverPrimary: `1px solid ${colors.purple.light}`,
    borderPressedPrimary: `1px solid ${colors.purple.dark}`,
    colorPrimary: colors.purple.DEFAULT,
    colorFocusPrimary: colors.purple.light,
    colorHoverPrimary: colors.purple.light,
    colorPressedPrimary: colors.purple.dark,
  },
  DataTable: {
    thColor: colors.grey.lightest,
  },
  Input: {
    heightMedium: '56px',
    border: `1px solid ${colors.grey.lighter}`,
    borderFocus: `1px solid ${colors.primary}`,
    borderHover: `1px solid ${colors.primary}`,
    borderError: `1px solid ${colors.red}`,
  },
  Switch: {
    railColor: colors.grey.lightest,
    railColorActive: colors.grey.lighter,
    railWidthMedium: '34px',
    railHeightMedium: '14px',
    buttonColor: colors.grey.DEFAULT,
    buttonHeightMedium: '20px',
    buttonWidthMedium: '20px',
  },
};
</script>
