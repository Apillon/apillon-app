<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <n-space justify="space-between" align="center">
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
      <TableBucket />
      <TableStorage />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: 'Authentication',
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(_ => {
      getServicesStorage();
      getBuckets();
      pageLoading.value = false;
    });
  }, 500);
});

async function getServicesStorage() {
  if (!dataStore.hasServices(ServiceType.STORAGE)) {
    await dataStore.getStorageServices($i18n);
  }
}

async function getBuckets() {
  if (!dataStore.hasServices(ServiceType.BUCKET)) {
    await dataStore.getBuckets();
  }
}
</script>
