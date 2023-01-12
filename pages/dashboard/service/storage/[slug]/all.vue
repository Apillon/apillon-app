<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
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
            :percentage="dataStore.currentBucket.percentage"
            :size="dataStore.currentBucket.size || 0"
            :max-size="dataStore.currentBucket.maxSize || 0"
          />
        </template>

        <template #submenu>
          <MenuBucketManagement />
        </template>
      </Heading>
    </template>

    <slot>
      <n-h5 prefix="bar" class="mb-8">{{ $t('storage.yourFilesAll') }}</n-h5>

      <!-- DataTable: All files in bucket -->
      <TableFilesAll />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
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
