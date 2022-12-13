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
      <StorageBreadcrumbs v-if="dataStore.selected.folderId" />
      <n-h5 v-else prefix="bar">{{ $t('storage.uploadFiles') }}</n-h5>

      <FormStorageUploadFiles :bucketUuid="dataStore.currentBucket.bucket_uuid" class="mt-4" />

      <n-h5 prefix="bar" class="mb-8">{{ $t('storage.yourFiles') }}</n-h5>
      <n-space vertical :size="12">
        <n-space justify="space-between">
          <div class="w-[20vw] max-w-xs">
            <n-input
              v-model:value="dataStore.folder.search"
              type="text"
              name="search"
              size="small"
              class="bg-grey-dark"
              placeholder="Search files"
            />
          </div>
          <n-space>
            <n-button size="small">
              <span class="icon-copy"></span>
              <span class="text-normal">Copy ARN</span>
            </n-button>
            <n-button size="small">Actions</n-button>
            <n-button size="small" @click="showModalNewFolder = true">
              {{ $t('storage.folder.create') }}
            </n-button>
            <n-button size="small">Download</n-button>
          </n-space>
        </n-space>

        <!-- DataTable: files and directories -->
        <TableFiles />
      </n-space>

      <!-- Modal - Create new folder -->
      <modal v-model:show="showModalNewFolder" :title="$t('storage.folder.createNew')">
        <FormStorageFolderCreate @submit-success="onFolderCreated" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const { params } = useRoute();
const router = useRouter();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);
const showModalNewFolder = ref<boolean>(false);

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  /** Bucket ID from route */
  dataStore.setBucketId(parseInt(`${params?.id}`));

  if (!Array.isArray(dataStore.services.bucket) || dataStore.services.bucket.length === 0) {
    Promise.all(Object.values(dataStore.promises)).then(_ => {
      dataStore.promises.buckets = dataStore.fetchBuckets();

      Promise.all(Object.values(dataStore.promises)).then(_ => {
        checkIfBucketExists();
      });
    });
  } else {
    checkIfBucketExists();
  }
});

/** Bucket from state, if bucket doesn't exists than redirect to storage */

function checkIfBucketExists() {
  if (
    !dataStore.services.bucket.find(
      (bucket: BucketInterface) => bucket.id === dataStore.selected.bucketId
    )
  ) {
    router.push({ name: 'dashboard' });
  }
  pageLoading.value = false;
}

function onFolderCreated() {
  showModalNewFolder.value = false;

  /** Refresh directory content */
  dataStore.fetchDirectoryContent($i18n);
}
</script>
