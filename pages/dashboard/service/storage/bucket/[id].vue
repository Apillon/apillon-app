<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <n-space align="center" :size="32" class="-mb-4">
        <NuxtLink :to="{ name: 'dashboard-service-storage' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h4>{{ $t('storage.bucketManagement') }}</h4>
        <Notification type="success">
          <span class="text-green">
            Bucket storage
            <strong class="text-grey-light">Bucketname</strong>
            was successfully created
          </span>
        </Notification>
      </n-space>
    </template>

    <template #infobar>
      <n-space align="center" justify="space-between" class="w-full">
        <Tag color="violet">{{ bucket.name }}</Tag>
        <span>
          <span class="icon-storage"></span>
          {{ $t('storage.bucket') }}
        </span>
        <ProgressStorage
          class="w-1/2"
          :percentage="bucket.percentage"
          :size="bucket.sizeMb"
          :max-size="bucket.maxSizeMb"
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
      <n-h5 prefix="bar" class="mb-8">{{ $t('storage.uploadFiles') }}</n-h5>
      <FormStorageUploadFiles :bucketUuid="bucket.bucket_uuid" />

      <n-h5 prefix="bar" class="mb-8">{{ $t('storage.yourFiles') }}</n-h5>
      <n-space vertical :size="12">
        <n-space justify="space-between">
          <div class="w-[20vw] max-w-xs">
            <n-input
              type="text"
              name="search"
              size="small"
              class="bg-grey-lightBg"
              placeholder="Search files"
            />
          </div>
          <n-space>
            <n-button size="small">
              <span class="icon-copy"></span>
              <span class="text-normal">Copy ARN</span>
            </n-button>
            <n-button size="small">Actions</n-button>
            <n-button size="small" @click="showModalNewFolder = true">Create folder</n-button>
            <n-button size="small">Download</n-button>
          </n-space>
        </n-space>

        <!-- DataTable: files and directories -->
        <TableFiles :bucketUuid="bucket.bucket_uuid" />
      </n-space>

      <!-- Modal - Create new folder -->
      <n-modal v-model:show="showModalNewFolder">
        <n-card
          style="width: 660px"
          :title="$t('storage.createNewFolder')"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
        >
          <FormStorageFolder :bucket-id="bucket.id" @submit-success="onFolderCreated" />
        </n-card>
      </n-modal>

      <!-- Drawer - Add new payment method -->
      <n-drawer v-model:show="drawerFileDetailsActive" :width="495">
        <n-drawer-content> Content </n-drawer-content>
        dibv
      </n-drawer>
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

/** Bucket ID from route */
const bucketId = parseInt(`${params?.id}`);

onMounted(() => {
  console.log('1');
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
const bucket = computed<BucketInterface>(() => {
  return dataStore.services.bucket.find((item: BucketInterface) => item.id === bucketId) || {};
});

function checkIfBucketExists() {
  if (!dataStore.services.bucket.find((bucket: BucketInterface) => bucket.id === bucketId)) {
    router.push({ name: 'dashboard' });
  }
  pageLoading.value = false;
}

function onFolderCreated() {
  showModalNewFolder.value = false;
  dataStore.fetchDirectoryContent(bucket.value.bucket_uuid, $i18n);
}
</script>
