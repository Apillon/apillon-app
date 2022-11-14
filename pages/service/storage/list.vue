<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <n-space justify="space-between" align="center">
        <n-space size="large" align="center">
          <h4 class="mr-">{{ $t('nav.storage') }}</h4>
          <div class="w-[1px] h-[13px] bg-grey"></div>
          <a href="#learn-more">{{ $t('general.learnMore') }}</a>
        </n-space>
        <nuxt-link to="/service/storage/new">
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
import { useDataStore } from '~~/stores/data';

const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: 'Authentication',
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(_ => {
    getServicesStorage();
    getBuckets();
  });
});

async function getServicesStorage() {
  if (!dataStore.currentProject) {
    console.warn('No project selected');
    setTimeout(() => (pageLoading.value = false), 300);
    return;
  } else if (Array.isArray(dataStore.services.storage) && dataStore.services.storage.length > 0) {
    setTimeout(() => (pageLoading.value = false), 300);
    return;
  }
  dataStore.services.storage = await dataStore.getServices(ServiceType.STORAGE);

  setTimeout(() => (pageLoading.value = false), 300);
}

async function getBuckets() {
  if (!dataStore.currentProject) {
    console.warn('No project selected');
    return;
  } else if (Array.isArray(dataStore.services.bucket) && dataStore.services.bucket.length > 0) {
    return;
  }

  await dataStore.getBuckets();

  setTimeout(() => (pageLoading.value = false), 300);
}
</script>
