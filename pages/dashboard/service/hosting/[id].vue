<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <!-- Actions -->
        <ActionsHostingWebsite />

        <!-- Upload files -->
        <FormHostingUploadWebsite :bucket-uuid="bucketStore.bucketUuid" />

        <div>
          <!-- Breadcrumbs -->
          <div class="relative mb-1 h-14 pt-2">
            <StorageBreadcrumbs v-if="bucketStore.folder.selected" class="absolute" />
          </div>
          <!-- DataTable: files and directories -->
          <transition name="fade" appear>
            <TableStorageFiles :type="TableFilesType.HOSTING" />
          </transition>
        </div>
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const bucketStore = useBucketStore();
const storageStore = useStorageStore();
const { pageLoading, initWebsite } = useHosting();

useHead({
  title: t('dashboard.nav.hosting'),
});

onMounted(() => {
  initWebsite();
  storageStore.getStorageInfo();
});
</script>
