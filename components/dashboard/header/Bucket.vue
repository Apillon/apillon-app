<template>
  <Heading>
    <slot>
      <n-space align="center" size="large" :wrap="false">
        <NuxtLink :to="{ name: 'dashboard-service-storage' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <h2 class="whitespace-nowrap">{{ bucketStore.active.name }}</h2>

        <n-space align="center" size="small" :wrap="false">
          <n-ellipsis class="text-body align-bottom" :line-clamp="1">
            {{ bucketStore.active.bucket_uuid }}
          </n-ellipsis>
          <button class="text-body" @click="copyToClipboard(bucketStore.active.bucket_uuid)">
            <span class="icon-copy"></span>
          </button>
        </n-space>
      </n-space>
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
