<template>
  <Dashboard :loading="pageLoading">
    <template #sidebar>
      <SidebarProjectSettings />
    </template>
    <slot>
      <h4 class="mb-6">{{ $t('dashboard.apiKey.title') }}</h4>

      <!-- Project ID -->
      <n-h5 prefix="bar">{{ $t('project.id') }}</n-h5>
      <TableProjectId />

      <!-- Secrets -->
      <n-h5 prefix="bar">{{ $t('dashboard.secrets') }}</n-h5>
      <n-space class="text-sm" size="large" align="center">
        <strong>
          {{ $t('general.scope') }}:
          <span class="text-primary">{{ dataStore.currentProject?.name }}</span>
        </strong>
        <div class="w-[1px] h-[13px] bg-grey"></div>
        <span>Test enviroment</span>
      </n-space>
      <TableApiKeys />
      <div class="text-right mt-5">
        <Btn type="secondary" @click="showDrawerGenerateApiKey">
          {{ $t('dashboard.apiKey.generate') }}
        </Btn>
      </div>

      <!-- Drawer - Generate new Key -->
      <n-drawer v-model:show="drawerGenerateApiKeyVisible" :width="495">
        <n-drawer-content>
          <template #header>
            <h5>{{ $t('dashboard.apiKey.generate') }}</h5>
          </template>
          <FormApiKeyCreate @close="drawerGenerateApiKeyVisible = false" />
        </n-drawer-content>
      </n-drawer>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: t('dashboard.apiKey.title'),
});

/**
 * Drawer - add payment
 */
const drawerGenerateApiKeyVisible = ref(false);
const showDrawerGenerateApiKey = () => {
  drawerGenerateApiKeyVisible.value = true;
};

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(_ => {
    dataStore.getAllServices();
    settingsStore.fetchApiKeys();

    pageLoading.value = false;
  });
});
</script>
