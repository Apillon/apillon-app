<template>
  <div id="app" class="min-h-screen">
    <n-config-provider :locale="deDE" :date-locale="dateDeDE">
      <NuxtLayout>
        <portal-target :name="Portals.LAYOUT" multiple />

        <NuxtPage />
      </NuxtLayout>
    </n-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { NConfigProvider, enUS, dateEnUS, deDE, dateDeDE } from 'naive-ui';

useHead({
  lang: 'sl-SI',
});

const lang = ref('sl-SI');
console.log(enUS);
console.log(dateEnUS);
</script>
