<template>
  <Heading>
    <slot>
      <n-space align="center" :size="32">
        <NuxtLink :to="{ name: 'dashboard-service-storage' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h4>{{ dataStore.bucket.active.name }}</h4>
      </n-space>
    </slot>

    <template #info>
      <StorageProgress
        class="w-1/2"
        :key="dataStore.bucket.active.uploadedSize || 0"
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
