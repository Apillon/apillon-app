<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h4>{{ $t('dashboard.apiKey.title') }}</h4>
        </slot>

        <template #info>
          <span class="icon-info"></span>
        </template>

        <template #submenu>
          <MenuProjectSettings />
        </template>
      </Heading>
    </template>

    <slot>
      <h4 class="mb-6">{{ $t('dashboard.apiKey.title') }}</h4>

      <!-- Secrets -->
      <n-h5 prefix="bar">{{ $t('dashboard.secrets') }}</n-h5>
      <n-space class="text-sm" size="large" align="center">
        <strong>
          {{ $t('general.scope') }}:
          <span class="text-primary">{{ dataStore.currentProject?.name }}</span>
        </strong>
      </n-space>
      <TableApiKeys />
      <div class="text-right mt-5">
        <Btn
          type="secondary"
          :disabled="settingsStore.isProjectUser()"
          @click="showDrawerGenerateApiKey"
        >
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
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    /** Fetch all services if there is any service type unloaded */
    if (
      !dataStore.hasServices(ServiceType.AUTHENTICATION) ||
      !dataStore.hasServices(ServiceType.STORAGE) ||
      !dataStore.hasServices(ServiceType.COPMUTING)
    ) {
      await dataStore.getAllServices();
    }
    /** Fetch all api keys if they are not stored in settings store */
    if (!settingsStore.hasApiKeys) {
      await settingsStore.fetchApiKeys();
    }

    pageLoading.value = false;
  });
});
</script>
