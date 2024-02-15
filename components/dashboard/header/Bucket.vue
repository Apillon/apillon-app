<template>
  <Heading>
    <slot>
      <div class="flex gap-4 items-center">
        <NuxtLink :to="{ name: 'dashboard-service-storage' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <n-space align="baseline" :size="[12, 0]" :wrap="true">
          <h2 class="whitespace-nowrap">{{ bucketStore.active.name }}</h2>
          <TableEllipsis :prefix="$t('general.uuid')" :text="bucketStore.active.bucket_uuid" />
        </n-space>
      </div>
    </slot>

    <template #info>
      <StorageProgress
        :key="storageStore.info.usedStorage"
        :size="storageStore.info.usedStorage"
        :max-size="storageStore.info.availableStorage"
      />
    </template>

    <template #submenu>
      <MenuBucket />
    </template>
  </Heading>
</template>

<script lang="ts" setup>
const bucketStore = useBucketStore();
const storageStore = useStorageStore();

onMounted(() => {
  storageStore.getStorageInfo();
});
</script>
