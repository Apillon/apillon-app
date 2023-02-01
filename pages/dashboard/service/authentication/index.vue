<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <BannerAuthentication />
    </template>
    <slot>
      <h5 class="mb-8">{{ $t('nav.services') }}</h5>
      <div class="flex flex-col md:flex-row items-center justify-between bg-bg-lighter px-6 py-4">
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
const $i18n = useI18n();
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
  if (!dataStore.hasServices(ServiceType.AUTHENTICATION)) {
    await dataStore.getAuthServices();
  }
  pageLoading.value = false;
}
</script>
