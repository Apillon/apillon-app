<template>
  <Dashboard>
    <template #sidebar>
      <SidebarProjectSettings />
    </template>
    <slot>
      <h4 class="mb-6">{{ $t('dashboard.credentialsAndApiKeys') }}</h4>

      <!-- Project ID -->
      <n-h5 prefix="bar">{{ $t('dashboard.projectId') }}</n-h5>
      <TableProjectId />

      <!-- Secrets -->
      <n-h5 prefix="bar">{{ $t('dashboard.secrets') }}</n-h5>
      <n-space class="text-sm" size="large" align="center">
        <strong>Scope: <span class="text-primary">24.com Auth Internal</span> </strong>
        <div class="w-[1px] h-[13px] bg-grey"></div>
        <span>Test enviroment</span>
      </n-space>
      <TableApiKeys />
      <div class="text-right mt-5">
        <Btn type="secondary" @click="showDrawerGenerateApiKey">
          {{ $t('dashboard.generateNewKey') }}
        </Btn>
      </div>

      <!-- Drawer - Generate new Key -->
      <n-drawer v-model:show="drawerGenerateApiKeyVisible" :width="495">
        <n-drawer-content>
          <template #header>
            <h5>{{ $t('dashboard.generateNewKey') }}</h5>
          </template>
          <p class="pb-4 mb-4 border-b-1 border-grey/40 text-sm">
            <strong>API key name: </strong>
            <strong class="text-primary">24.com Auth Internal</strong>
          </p>
          <FormGenerateApiKey />
        </n-drawer-content>
      </n-drawer>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  title: t('dashboard.credentialsAndApiKeys'),
});

/**
 * Drawer - add payment
 */
const drawerGenerateApiKeyVisible = ref(false);
const showDrawerGenerateApiKey = () => {
  drawerGenerateApiKeyVisible.value = true;
};
</script>
