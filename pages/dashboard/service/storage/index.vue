<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h4 class="mr-">{{ $t('nav.storage') }}</h4>
        </slot>

        <template #info>
          <nuxt-link
            v-show="!settingsStore.isProjectUser()"
            :to="{ name: 'dashboard-service-storage-new' }"
          >
            <n-button type="primary">
              {{ $t('storage.bucket.new') }}
            </n-button>
          </nuxt-link>
        </template>
      </Heading>
    </template>
    <slot>
      <!-- Banner for storage if project hasb't got any services -->
      <BannerStorage v-if="!dataStore.hasBuckets" />

      <TableBucket v-if="dataStore.hasBuckets" />
      <template v-else>
        <h5 class="mb-8">{{ $t('nav.storage') }}</h5>
        <div class="flex flex-col md:flex-row items-center justify-between bg-bg-lighter px-6 py-4">
          <div class="mb-4 md:mb-0">
            <p class="body-md font-bold">{{ $t('storage.noActiveService') }}</p>
            <p class="body-sm">{{ $t('storage.attachService') }}</p>
          </div>
          <div>
            <nuxt-link :to="{ name: 'dashboard-service-storage-new' }">
              <Btn type="primary">{{ $t('storage.bucket.addNew') }}</Btn>
            </nuxt-link>
          </div>
        </div>
      </template>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await getBuckets();

    pageLoading.value = false;
  });

  getUsersOnProject();
});

async function getBuckets() {
  if (!dataStore.hasBuckets) {
    dataStore.promises.buckets = await dataStore.fetchBuckets();
  }
}

/** GET Users on project */
async function getUsersOnProject() {
  if (!settingsStore.hasUsers) {
    await settingsStore.fetchProjectUsers();
  }
}
</script>
