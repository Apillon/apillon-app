<template>
  <Heading>
    <slot> </slot>
    <slot>
      <n-space align="center" size="large">
        <NuxtLink :to="{ name: 'dashboard-service-embedded-wallet' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <h2>{{ $t('dashboard.nav.embeddedWallet') }}: {{ settingsStore.activeWallet?.name }}</h2>
      </n-space>
    </slot>

    <template #info>
      <n-space :size="32" align="center" justify="end"> </n-space>
    </template>
  </Heading>
</template>

<script lang="ts" setup>
const settingsStore = useSettingsStore();
</script>
