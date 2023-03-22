<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderBucket />
    </template>

    <slot>
      <n-h5 prefix="bar" class="mb-8">{{ $t('storage.yourFilesAll') }}</n-h5>

      <!-- DataTable: All files in bucket -->
      <TableStorageFilesAll />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const { pageLoading, initBucket } = useStorage();

useHead({
  title: $i18n.t('dashboard.nav.storage'),
});

onMounted(() => {
  initBucket();
});
</script>
