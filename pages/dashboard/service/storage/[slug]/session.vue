<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderBucket />
    </template>

    <slot>
      <TableStorageFileSessions />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { pageLoading, initBucket } = useStorage();

useHead({
  title: t('dashboard.nav.storage'),
});

onMounted(() => {
  initBucket();
});
</script>
