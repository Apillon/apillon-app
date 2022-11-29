<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <BannerStorage />
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
      <h5 class="mb-8">{{ $t('nav.storage') }}</h5>
      <div class="flex flex-col md:flex-row items-center justify-between bg-grey-lightBg px-6 py-4">
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
  Promise.all(Object.values(dataStore.promises)).then(_ => {
    getServicesStorage();
  });
});

async function getServicesStorage() {
  if (!dataStore.hasServices(ServiceType.STORAGE)) {
    await dataStore.getStorageServices($i18n);
  }
  pageLoading.value = false;
}
</script>
