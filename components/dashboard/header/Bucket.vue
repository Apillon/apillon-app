<template>
  <Heading>
    <slot>
      <n-space align="center" :size="32" :wrap="false">
        <NuxtLink :to="{ name: 'dashboard-service-storage' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h4 class="whitespace-nowrap">{{ bucketStore.active.name }}</h4>

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
        :key="bucketStore.active.uploadedSize || 0"
        class="w-1/2"
        :percentage="bucketStore.active.percentage"
        :size="bucketStore.active.uploadedSize || 0"
        :max-size="bucketStore.active.maxSize"
      />
    </template>

    <template #submenu>
      <MenuBucketManagement />
    </template>
  </Heading>
</template>

<script lang="ts" setup>
const bucketStore = useBucketStore();
</script>
