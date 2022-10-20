<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <BannerAuthentication />
      <n-space justify="space-between" align="center">
        <n-space size="large" align="center">
          <h4 class="mr-">{{ $t('nav.authentication') }}</h4>
          <div class="w-[1px] h-[13px] bg-grey"></div>
          <a href="#learn-more">{{ $t('general.learnMore') }}</a>
        </n-space>
        <n-button type="primary">{{ $t('general.attach') }}</n-button>
      </n-space>
    </template>
    <template #sidebar>
      <SidebarProjectPages />
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
      <TableAuthentication />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { NButton, NSpace } from 'naive-ui';
import { getServices } from '~~/lib/service';

useHead({
  title: 'Authentication',
});

const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);

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
  dataStore.services.authentication = await getServices(
    dataStore.currentProject.id,
    ServiceType.AUTHENTICATION
  );
  setTimeout(() => (pageLoading.value = false), 300);
}
</script>
