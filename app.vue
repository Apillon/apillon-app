<template>
  <div id="app" class="min-h-screen">
    <n-config-provider>
      <NuxtLayout>
        <portal-target :name="Portals.LAYOUT" multiple />
        <LanguageSwitcher />
        <NuxtPage />
      </NuxtLayout>
    </n-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { NConfigProvider } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const lang = computed(() => {
  return $i18n.locale.value;
});

useHead({
  htmlAttrs: {
    lang,
  },
});
</script>
