<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <n-space align="center" :size="32" class="-mb-4">
        <NuxtLink :to="{ name: 'dashboard-service-storage' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h4>{{ $t('storage.bucketManagement') }}</h4>
      </n-space>
    </template>

    <template #infobar>
      <n-space align="center" justify="space-between" class="w-full">
        <Tag color="violet">{{ dataStore.currentBucket.name }}</Tag>
        <span>
          <span class="icon-storage"></span>
          {{ $t('storage.bucket') }}
        </span>
        <StorageProgress
          class="w-1/2"
          :percentage="dataStore.currentBucket.percentage"
          :size="dataStore.currentBucket.sizeMb"
          :max-size="dataStore.currentBucket.maxSizeMb"
        />
      </n-space>
    </template>

    <template #sidebar>
      <SidebarBucketManagement />
    </template>

    <template #learn>
      <LearnAlert>
        Click on a service you want to attach to your project. After configuring it, the service
        will become operational.
        <strong>Keep in mind, you can always edit the attached services or add new ones.</strong>
      </LearnAlert>
      <LearnCollapse />
    </template>

    <slot>
      <n-h5 prefix="bar" class="mb-8">{{ $t('storage.webhook') }}</n-h5>

      <FormStorageWebhook :bucketId="dataStore.bucket.selected" />
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
