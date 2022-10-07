<template>
  <div id="app" class="bg-dark">
    <n-config-provider
      :theme="theme"
      :theme-overrides="themeOverrides"
      :locale="locale"
      :date-locale="dateLocale"
    >
      <NuxtLayout>
        <NuxtPage />
        <portal-target :name="Portals.LAYOUT" multiple />
      </NuxtLayout>
    </n-config-provider>
    <!-- <CookieConsent /> -->
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

/**  Theme switcher dark/light mode
const prefersTheme =
  localStorage.getItem('theme') === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme:dark)').matches);
  */
const prefersTheme = 'dark';
const themeName = prefersTheme ? 'dark' : 'light';
localStorage.setItem('theme', themeName);

const theme = computed(() => {
  return prefersTheme ? darkTheme : lightTheme;
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
    primaryColorHover: colors.primary,
    primaryColorPressed: colors.primary,
  },
  Button: {
    fontSizeMedium: '16px',
    fontWeight: 'bold',
    heightMedium: '56px',
    heightSmall: '44px',
    heightTiny: '24px',
    borderPrimary: `2px solid ${colors.primary}`,
    borderFocusPrimary: `2px solid ${colors.primary}`,
    borderHoverPrimary: `2px solid ${colors.primary}`,
    borderPressedPrimary: `2px solid ${colors.primary}`,
    borderRadiusTiny: '0px',
    borderRadiusSmall: '0px',
    borderRadiusMedium: '0px',
    borderRadiusLarge: '0px',
  },
  DataTable: {
    thColor: colors.dark,
  },
  Input: {
    heightMedium: '56px',
    fontSizeMedium: '18px',
    color: colors.grey.dark,
    textColor: colors.grey.DEFAULT,
    border: `1px solid ${colors.grey.DEFAULT}`,
    borderFocus: `1px solid ${colors.primary}`,
    borderHover: `1px solid ${colors.primary}`,
    borderError: `1px solid ${colors.pink}`,
    borderRadius: '0px',
  },
  Switch: {
    railColor: colors.grey.light,
    railColorActive: colors.grey.light,
    railWidthMedium: '34px',
    railHeightMedium: '14px',
    buttonColor: colors.grey.DEFAULT,
    buttonHeightMedium: '20px',
    buttonWidthMedium: '20px',
  },
};
</script>
