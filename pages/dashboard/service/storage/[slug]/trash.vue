<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderBucket />
    </template>
    <slot>
      <TableStorageTrash v-if="fileStore.hasDeletedFiles" />
      <Empty
        v-else
        :title="$t('storage.file.nothingHere')"
        :info="$t('storage.file.deletedFiles')"
        icon="storage/empty"
      />

      <!-- W3Warn: destroyed buckets -->
      <W3Warn v-model:show="showModalW3Warn">
        {{ $t('w3Warn.bucket.destroyed') }}
      </W3Warn>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const fileStore = useFileStore();
const { pageLoading, initBucket } = useStorage();
const showModalW3Warn = ref<boolean>(false);

useHead({
  title: $i18n.t('dashboard.nav.storage'),
});

onMounted(() => {
  initBucket();
});
</script>
