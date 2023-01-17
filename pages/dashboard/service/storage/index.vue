<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h4>{{ $t('nav.storage') }}</h4>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <button class="align-sub" @click="showModalW3Warn = true">
              <span class="icon-info text-xl"></span>
            </button>
            <Btn v-if="dataStore.hasBuckets" type="primary" size="small" @click="createNewBucket">
              {{ $t('storage.bucket.new') }}
            </Btn>
          </n-space>
        </template>
      </Heading>
    </template>
    <slot>
      <TableBucket v-if="dataStore.hasBuckets" />
      <template v-else>
        <div
          class="flex flex-col items-center justify-center px-6 py-4"
          style="min-height: calc(100vh - 250px)"
        >
          <div class="mb-4">
            <NuxtIcon name="storage/empty" class="icon-auto" filled />
          </div>
          <div class="mb-10 text-center">
            <h3 class="font-bold">{{ $t('storage.noActiveService') }}</h3>
            <p class="text-body">{{ $t('storage.attachService') }}</p>
          </div>
          <div>
            <Btn type="primary" @click="createNewBucket">
              {{ $t('storage.bucket.new') }}
            </Btn>
          </div>
        </div>
      </template>

      <W3Warn v-model:show="showModalW3Warn" @update:show="onModalW3WarnHide">
        {{ $t('w3Warn.newBucket') }}
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
const settingsStore = useSettingsStore();
const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);
const showModalNewBucket = ref<boolean | null>(false);

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await getBuckets();
    await geBucketQuota();

    pageLoading.value = false;
  });

  getUsersOnProject();
});

/** GET Buckets if bucket list is empty */
async function getBuckets() {
  if (!dataStore.hasBuckets) {
    dataStore.promises.buckets = await dataStore.fetchBuckets();
  }
}

/** GET Bucket quota, if current value is null  */
async function geBucketQuota() {
  if (dataStore.bucket.quotaReached === undefined) {
    await dataStore.fetchBucketQuota();
  }
}

/** GET Users on project */
async function getUsersOnProject() {
  if (!settingsStore.hasUsers) {
    await settingsStore.fetchProjectUsers();
  }
}

/**
 * On createNewBucket click
 * If W3Warn has already been shown, show modal create new bucekt, otherwise show warn first
 * */
function createNewBucket() {
  if (sessionStorage.getItem(LsW3WarnKeys.NEW_BUCKET)) {
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
      sessionStorage.setItem(LsW3WarnKeys.NEW_BUCKET, Date.now().toString());
    }
  }
);
</script>
