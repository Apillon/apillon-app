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
import { GlobalThemeOverrides, lightTheme, darkTheme, enUS, dateEnUS } from 'naive-ui';
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
  Alert: {},
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
  Card: {
    borderColor: colors.primary,
    borderRadius: '0px',
    color: colors.grey.lightBg,
    colorEmbedded: colors.grey.lightBg,
    colorEmbeddedModal: colors.grey.lightBg,
    colorEmbeddedPopover: colors.grey.lightBg,
    colorModal: colors.grey.lightBg,
    colorPopover: colors.grey.lightBg,
    colorTarget: colors.grey.lightBg,
  },
  Checkbox: {
    sizeMedium: '18px',
    sizeLarge: '24px',
    fontSizeMedium: '14px',
    fontSizeLarge: '14px',
    textColor: colors.grey.DEFAULT,
  },
  Collapse: {},
  DataTable: {
    borderColor: colors.grey.lightBg,
    thColor: colors.grey.dark,
    tdColor: colors.grey.lightBg,
    tdColorHover: colors.dark,
    thFontWeight: '700',
  },
  Dialog: {
    color: colors.grey.lightBg,
  },
  Drawer: {
    color: colors.black,
    headerBorderBottom: '0',
    headerPadding: '32px 32px 16px 32px',
    bodyPadding: '16px 32px 16px 32px',
    footerPadding: '16px 32px 32px 32px',
  },
  Form: {
    labelTextColor: colors.grey.light,
  },
  Input: {
    heightSmall: '42px',
    heightMedium: '56px',
    fontSizeMedium: '18px',
    caretColor: colors.primary,
    color: colors.grey.dark,
    textColor: colors.grey.light,
    border: `1px solid ${colors.grey.DEFAULT}`,
    borderFocus: `1px solid ${colors.primary}`,
    borderHover: `1px solid ${colors.primary}`,
    borderError: `1px solid ${colors.pink}`,
    borderRadius: '0px',
    paddingMedium: '20px',
    placeholderColor: colors.grey.DEFAULT,
  },
  Menu: {
    color: colors.grey.lightBg,
    itemColorHover: colors.dark,
    itemHeight: 'auto',
  },
  Message: {
    borderRadius: '0px',
    color: colors.grey.lightBg,
    colorError: colors.grey.lightBg,
    colorInfo: colors.grey.lightBg,
    colorLoading: colors.grey.lightBg,
    colorSuccess: colors.grey.lightBg,
    colorWarning: colors.grey.lightBg,
    iconColorError: colors.pink,
    iconColorInfo: colors.blue,
    iconColorSuccess: colors.green,
    iconColorWarning: colors.yellow,
    textColorError: colors.pink,
    textColorInfo: colors.blue,
    textColorSuccess: colors.green,
    textColorWarning: colors.yellow,
  },
  Radio: {
    boxShadow: `inset 0 0 0 1px ${colors.grey.DEFAULT}`,
    fontSizeSmall: '16px',
    fontSizeMedium: '18px',
    fontSizeLarge: '20px',
    radioSizeSmall: '16px',
    radioSizeMedium: '20px',
    radioSizeLarge: '24px',
    textColor: colors.grey.light,
  },
  Skeleton: {
    color: colors.grey.lightBg,
    colorEnd: colors.grey.DEFAULT,
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
  Tag: {
    color: colors.grey.dark,
    colorInfo: colors.blue,
    colorSuccess: colors.grey.dark,
    textColor: colors.grey.DEFAULT,
    textColorInfo: colors.dark,
    textColorSuccess: colors.green,
  },
  Select: {
    peers: {
      InternalSelection: {
        border: `1px solid ${colors.grey.DEFAULT}`,
        borderRadius: '0px',
        heightSmall: '24px',
        heightMedium: '40px',
        heightLarge: '56px',
        color: colors.transparent,
      },
      InternalSelectMenu: {
        color: colors.grey.lightBg,
      },
    },
  },
};
</script>
