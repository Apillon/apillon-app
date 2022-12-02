<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <!-- Banner for storage if project hasb't got any services -->
      <BannerStorage v-if="!dataStore.hasServices(ServiceType.STORAGE)" />

      <!-- Basic title -->
      <n-space v-else justify="space-between" align="center">
        <n-space size="large" align="center">
          <h4 class="mr-">{{ $t('nav.storage') }}</h4>
          <div class="w-[1px] h-[13px] bg-grey"></div>
          <a href="#learn-more">{{ $t('general.learnMore') }}</a>
        </n-space>
        <nuxt-link :to="{ name: 'dashboard-service-storage-new' }">
          <n-button type="primary">{{ $t('storage.newBucket') }}</n-button>
        </nuxt-link>
      </n-space>
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
      <TableBucket v-if="dataStore.hasServices(ServiceType.BUCKET)" />
      <TableStorage v-if="dataStore.hasServices(ServiceType.STORAGE)" />
      <template v-else>
        <h5 class="mb-8">{{ $t('nav.storage') }}</h5>
        <div
          class="flex flex-col md:flex-row items-center justify-between bg-grey-lightBg px-6 py-4"
        >
          <div class="mb-4 md:mb-0">
            <p class="body-md font-bold">Your project currently has no active service</p>
            <p class="body-sm">
              First attach a desired service and configure it, then start building.
            </p>
          </div>
          <div>
            <nuxt-link :to="{ name: 'dashboard-service-storage-new' }">
              <Btn type="primary"> Add new bucket</Btn>
            </nuxt-link>
          </div>
        </div>
      </template>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await getServicesStorage();
    await getBuckets();

    pageLoading.value = false;
  });
});

async function getServicesStorage() {
  if (!dataStore.hasServices(ServiceType.STORAGE)) {
    await dataStore.getStorageServices($i18n);
  }
}
async function getBuckets() {
  if (!dataStore.hasServices(ServiceType.BUCKET)) {
    dataStore.promises.buckets = await dataStore.fetchBuckets($i18n);
  }
}
</script>
