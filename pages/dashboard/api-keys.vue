<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h2>{{ $t('dashboard.apiKey.title') }}</h2>
        </slot>

        <template #info> </template>

        <template #submenu>
          <MenuProjectSettings />
        </template>
      </Heading>
    </template>

    <slot>
      <!-- <h4 class="mb-6">{{ $t('dashboard.apiKey.title') }}</h4> -->

      <!-- Secrets -->
      <!-- <n-h5 prefix="bar">{{ $t('dashboard.secrets') }}</n-h5> -->
      <n-space class="my-4 text-sm" size="large" align="center">
        <strong>
          {{ $t('general.scope') }}:
          <span class="text-primary"> &nbsp; {{ dataStore.currentProject?.name }}</span>
        </strong>
      </n-space>
      <TableApiKeys />
      <div v-if="!dataStore.isProjectUser" class="mt-5 text-right">
        <Btn type="secondary" @click="drawerGenerateApiKeyVisible = true">
          {{ $t('dashboard.apiKey.generate') }}
        </Btn>
      </div>

      <!-- Drawer - Generate new Key -->
      <n-drawer v-model:show="drawerGenerateApiKeyVisible" :width="495">
        <n-drawer-content :native-scrollbar="false">
          <template #header>
            <h5>{{ $t('dashboard.apiKey.generate') }}</h5>
          </template>
          <FormApiKey @close="drawerGenerateApiKeyVisible = false" />
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

onMounted(async () => {
  await sleep(300);
  await dataStore.waitOnPromises();
  /** Fetch all services if there is any service type unloaded */
  await dataStore.getServices();
  /** Fetch all api keys if they are not stored in settings store */
  await settingsStore.getApiKeys();

  pageLoading.value = false;
});
</script>
