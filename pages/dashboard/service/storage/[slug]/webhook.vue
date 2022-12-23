<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <n-space align="center" :size="32" class="-mb-4">
        <NuxtLink :to="{ name: 'dashboard-service-storage' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h4>{{ $t('storage.bucket.management') }}</h4>
      </n-space>
    </template>

    <template #infobar>
      <n-space align="center" justify="space-between" class="w-full">
        <Tag color="violet">{{ dataStore.currentBucket.name }}</Tag>
        <span>
          <span class="icon-storage"></span>
          {{ $t('storage.bucket.storage') }}
        </span>
        <StorageProgress
          class="w-1/2"
          :percentage="dataStore.currentBucket.percentage"
          :size="dataStore.currentBucket.size || 0"
          :max-size="dataStore.currentBucket.maxSize || 0"
        />
      </n-space>
    </template>

    <template #sidebar>
      <SidebarBucketManagement />
    </template>

    <slot>
      <n-h5 prefix="bar" class="mb-8">{{ $t('storage.webhook') }}</n-h5>

      <FormStorageWebhook class="max-w-xl" :bucketId="dataStore.bucket.selected" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const { params } = useRoute();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  /** Bucket ID from route, then load buckets */
  dataStore.onBucketMounted(parseInt(`${params?.slug}`));

  Promise.all(Object.values(dataStore.promises)).then(_ => {
    pageLoading.value = false;
  });
});
</script>
