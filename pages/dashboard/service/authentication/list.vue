<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <n-space justify="space-between" align="center">
        <n-space size="large" align="center">
          <h4 class="mr-">{{ $t('dashboard.nav.authentication') }}</h4>
          <div class="w-[1px] h-[13px] bg-body"></div>
          <a href="#learn-more">{{ $t('general.learnMore') }}</a>
        </n-space>
        <n-button type="primary">{{ $t('general.attach') }}</n-button>
      </n-space>
    </template>
    <slot>
      <TableAuthentication />
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
