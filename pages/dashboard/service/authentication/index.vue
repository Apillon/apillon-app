<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <BannerAuthentication />
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
      <h5 class="mb-8">{{ $t('nav.services') }}</h5>
      <div class="flex flex-col md:flex-row items-center justify-between bg-grey-lightBg px-6 py-4">
        <div class="mb-4 md:mb-0">
          <p class="body-md font-bold">Your project currently has no active service</p>
          <p class="body-sm">
            First attach a desired service and configure it, then start building.
          </p>
        </div>
        <div>
          <nuxt-link :to="{ name: 'dashboard-service-authentication-list' }">
            <Btn type="primary"> Attach services</Btn>
          </nuxt-link>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useDataStore } from '~~/stores/data';

const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: 'Authentication',
  meta: [{ hid: 'og-type', name: 'og:type', property: 'og:type', content: 'website' }],
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(_ => {
    getServicesAuth();
  });
});

async function getServicesAuth() {
  if (!dataStore.currentProject) {
    console.warn('No project selected');
    pageLoading.value = false;
    return;
  }
  dataStore.services.authentication = await dataStore.getServices(ServiceType.AUTHENTICATION);
  setTimeout(() => (pageLoading.value = false), 300);
}
</script>
