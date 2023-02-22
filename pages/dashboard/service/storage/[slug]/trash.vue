<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderBucket />
    </template>
    <slot>
      <TableStorageTrash v-if="fileStore.hasDeletedFiles" />
      <template v-else>
        <div
          class="flex flex-col items-center justify-center px-6 py-4"
          style="min-height: calc(100vh - 270px)"
        >
          <div class="mb-4">
            <NuxtIcon name="storage/empty" class="icon-auto" filled />
          </div>
          <div class="mb-10 text-center">
            <h3 class="font-bold">{{ $t('general.nothingHere') }}</h3>
            <p class="text-body">{{ $t('storage.file.deletedFiles') }}</p>
          </div>
        </div>
      </template>

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
  title: $i18n.t('nav.storage'),
});

onMounted(async () => {
  initBucket();
});
</script>
