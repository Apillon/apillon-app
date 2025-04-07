<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderWebsite />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <div class="flex gap-6">
          <div class="card-light flex-1 rounded-lg px-6 py-4">
            <HostingWebsiteInfo />
          </div>

          <div class="card max-w-64 px-6 py-4">
            <h6 class="mb-2">{{ $t('general.quickActions') }}</h6>
            <ActionsHostingWebsite />
          </div>
        </div>

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
