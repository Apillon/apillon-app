<template>
  <Heading>
    <slot>
      <n-space align="center" :size="32" :wrap="false">
        <NuxtLink :to="{ name: 'dashboard-service-storage' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h4 class="whitespace-nowrap">{{ dataStore.bucket.active.name }}</h4>

        <n-space align="center" size="small" :wrap="false">
          <n-ellipsis class="text-grey align-bottom" :line-clamp="1">
            {{ dataStore.bucket.active.bucket_uuid }}
          </n-ellipsis>
          <button class="text-grey" @click="copyToClipboard(dataStore.bucket.active.bucket_uuid)">
            <span class="icon-copy"></span>
          </button>
        </n-space>
      </n-space>
    </slot>

    <template #info>
      <StorageProgress
        :key="dataStore.bucket.active.uploadedSize || 0"
        class="w-1/2"
        :percentage="dataStore.bucket.active.percentage"
        :size="dataStore.bucket.active.uploadedSize || 0"
        :max-size="dataStore.bucket.active.maxSize"
      />
    </template>

    <template #submenu>
      <MenuBucketManagement />
    </template>
  </Heading>
</template>

<script lang="ts" setup>
const dataStore = useDataStore();
</script>
