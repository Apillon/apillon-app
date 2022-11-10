<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <h5>{{ $t('storage.newBucket') }}</h5>
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
      <FormStorageNew class="max-w-[520px]" />
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
    getServicesAuth();
  });
});

async function getServicesAuth() {
  if (!dataStore.currentProject) {
    console.warn('No project selected');
    return;
  }
  dataStore.services.storage = await dataStore.getServices(ServiceType.STORAGE);

  setTimeout(() => (pageLoading.value = false), 300);
}
</script>
