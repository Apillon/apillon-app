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
          <div class="relative h-8">
            <StorageBreadcrumbs v-if="bucketStore.folder.selected" class="absolute" />
          </div>
          <!-- DataTable: files and directories -->
          <transition name="fade" appear>
            <TableStorageFiles />
          </transition>
        </div>
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const bucketStore = useBucketStore();
const { pageLoading, initWebsite } = useHosting();

useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(() => {
  initWebsite();
});
</script>
