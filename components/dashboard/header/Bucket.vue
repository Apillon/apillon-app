<template>
  <Heading>
    <slot>
      <div class="flex items-center gap-4">
        <NuxtLink :to="{ name: 'dashboard-service-storage' }">
          <span class="icon-back align-sub text-2xl"></span>
        </NuxtLink>
        <div>
          <h2>{{ bucketStore.active.name }}</h2>
          <TableEllipsis :prefix="$t('storage.bucket.uuid')" :text="bucketStore.active.bucket_uuid" />
        </div>
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
