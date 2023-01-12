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

    <slot>
      <!-- Breadcrumbs -->
      <transition name="fade" appear>
        <div v-show="dataStore.folder.selected" class="mb-4">
          <StorageBreadcrumbs v-if="dataStore.folder.selected" />
        </div>
      </transition>

      <!-- Upload files -->
      <transition name="fade" appear>
        <div v-show="dataStore.folder.uploadActive" class="mb-8">
          <n-h5 v-if="dataStore.folder.uploadActive && !dataStore.folder.selected" prefix="bar">
            {{ $t('storage.uploadFiles') }}
          </n-h5>
          <FormStorageUploadFiles
            v-if="dataStore.folder.uploadActive"
            :bucketUuid="dataStore.currentBucket.bucket_uuid"
            class="mt-4 pr-[2px] pb-1 mb-1"
          />
        </div>
      </transition>

      <div>
        <n-h5 v-if="dataStore.folder.uploadActive || !dataStore.folder.selected" prefix="bar">
          {{ $t('storage.yourFiles') }}
        </n-h5>
        <n-space vertical :size="12" class="mt-8">
          <!-- Actions -->
          <StorageActions />

          <!-- DataTable: files and directories -->
          <TableFiles />
        </n-space>
      </div>
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
  dataStore.onBucketMounted(parseInt(`${params?.id}`));

  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await dataStore.fetchBucket(parseInt(`${params?.id}`));

    if (!dataStore.bucket.active.size) {
      dataStore.folder.uploadActive = true;
    }
    pageLoading.value = false;
  });
});
</script>
