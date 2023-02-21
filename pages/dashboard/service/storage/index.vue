<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('nav.storage') }}</h1>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <button class="align-sub" @click="showModalW3Warn = true">
              <span class="icon-info text-xl"></span>
            </button>
          </n-space>
        </template>

        <template #submenu>
          <MenuStorage />
        </template>
      </Heading>
    </template>
    <slot>
      <TableStorageBucket v-if="bucketStore.hasBuckets" :buckets="bucketStore.items" />
      <Empty
        :title="$t('storage.bucket.noActiveService')"
        :info="$t('storage.bucket.attachService')"
        icon="storage/empty"
      >
        <Btn type="primary" @click="createNewBucket">
          {{ $t('storage.bucket.new') }}
        </Btn>
      </Empty>

      <W3Warn v-model:show="showModalW3Warn" @update:show="onModalW3WarnHide">
        {{ $t('w3Warn.bucket.new') }}
      </W3Warn>

      <!-- Modal - Create bucket -->
      <modal v-model:show="showModalNewBucket" :title="$t('project.newBucket')">
        <FormStorageBucket @submit-success="showModalNewBucket = false" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);
const showModalNewBucket = ref<boolean | null>(false);

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await bucketStore.getBuckets();
    await geBucketQuota();

    pageLoading.value = false;
  });
});

/** GET Bucket quota, if current value is null  */
async function geBucketQuota() {
  if (bucketStore.quotaReached === undefined) {
    await bucketStore.fetchBucketQuota();
  }
}

/**
 * On createNewBucket click
 * If W3Warn has already been shown, show modal create new bucket, otherwise show warn first
 * */
function createNewBucket() {
  if (sessionStorage.getItem(LsW3WarnKeys.BUCKET_NEW)) {
    showModalNewBucket.value = true;
  } else {
    showModalW3Warn.value = true;
    showModalNewBucket.value = null;
  }
}

/** When user close W3Warn, allow him to create new bucket */
function onModalW3WarnHide(value: boolean) {
  if (!value && showModalNewBucket.value !== false) {
    showModalNewBucket.value = true;
  }
}

/** Watch showModalNewBucket, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      sessionStorage.setItem(LsW3WarnKeys.BUCKET_NEW, Date.now().toString());
    }
  }
);
</script>
