<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <BannerStorage />
    </template>
    <slot>
      <n-space align="center" class="mb-6">
        <NuxtLink :to="{ name: 'dashboard-service-storage' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h5>{{ $t('storage.bucket.new') }}</h5>
      </n-space>
      <FormStorageBucket class="max-w-xl" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('storage.bucket.new'),
});

onMounted(async () => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    /** GET Bucket quota */
    await dataStore.fetchBucketQuota($i18n);
    pageLoading.value = false;
  });
});
</script>
