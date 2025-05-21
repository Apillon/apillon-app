<template>
  <Heading
    :back="{ name: 'dashboard-service-storage' }"
    docs="https://wiki.apillon.io/web3-services/2-web3-storage.html"
    :info="$t('w3Warn.bucket.new')"
    :service="ServiceTypeName.STORAGE"
  >
    <div>
      <h3>{{ bucketStore.active.name }}</h3>
      <TableEllipsis :prefix="$t('storage.bucket.uuid')" :text="bucketStore.active.bucket_uuid" />
    </div>

    <template #details>
      <StorageProgress
        :key="storageStore.info.usedStorage"
        :size="storageStore.info.usedStorage"
        :max-size="storageStore.info.availableStorage"
      />
      <hr class="my-10 border-bg-lighter" />
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
