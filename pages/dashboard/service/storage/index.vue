<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading
        :headline="$t('dashboard.nav.storage')"
        docs="https://wiki.apillon.io/web3-services/2-web3-storage.html"
        :info="$t('w3Warn.bucket.new')"
        :service="ServiceTypeName.STORAGE"
      >
        <template #details>
          <StorageProgress
            :key="storageStore.info.usedStorage"
            :size="storageStore.info.usedStorage"
            :max-size="storageStore.info.availableStorage"
          />
          <hr class="my-10 border-bg-lighter" />
        </template>

        <template #submenu>
          <MenuStorage />
        </template>
      </Heading>
    </template>
    <slot>
      <TableStorageBucket v-if="bucketStore.hasBuckets" :buckets="bucketStore.items" />
      <Empty
        v-else
        :title="$t('storage.bucket.noActiveService')"
        :info="$t('storage.bucket.attachService')"
        icon="storage/empty"
      >
        <Btn type="primary" @click="createNewBucket">
          {{ $t('storage.bucket.new') }}
        </Btn>
      </Empty>

      <W3Warn v-model:show="showModalW3Warn" @submit="onModalW3WarnHide">
        {{ $t('w3Warn.bucket.new') }}
      </W3Warn>

      <!-- Modal - Create bucket -->
      <modal v-model:show="showModalNewBucket" :title="$t('project.newBucket')">
        <FormStorageBucket @submit-success="showModalNewBucket = false" @create-success="onBucketCreated" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const storageStore = useStorageStore();
const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);
const showModalNewBucket = ref<boolean | null>(false);

useHead({
  title: t('dashboard.nav.storage'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await storageStore.getStorageInfo();
  await bucketStore.getBuckets();

  pageLoading.value = false;
});

/**
 * On createNewBucket click
 * If W3Warn has already been shown, show modal create new bucket, otherwise show warn first
 * */
function createNewBucket() {
  if (localStorage.getItem(LsW3WarnKeys.BUCKET_NEW)) {
    showModalNewBucket.value = true;
  } else {
    showModalW3Warn.value = true;
    showModalNewBucket.value = null;
  }
}

/** When user close W3Warn, allow him to create new bucket */
function onModalW3WarnHide() {
  if (showModalNewBucket.value !== false) {
    showModalNewBucket.value = true;
  }
}

/** Watch showModalNewBucket, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      localStorage.setItem(LsW3WarnKeys.BUCKET_NEW, Date.now().toString());
    }
  }
);

function onBucketCreated(bucket: BucketInterface) {
  router.push(`/dashboard/service/storage/${bucket.bucket_uuid}`);
}
</script>
