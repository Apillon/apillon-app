<template>
  <Dashboard>
    <template #sidebar>
      <SidebarProjectSettings />
    </template>
    <slot>
      <h4 class="mb-6">{{ $t('nav.projectSettings') }}</h4>

      <!-- Edit project -->
      <FormProjectSettings />

      <!-- Porject owner -->
      <n-h5 prefix="bar">{{ $t('project.owner') }}</n-h5>
      <TableProjectOwner />
      <div class="text-right">
        <NuxtLink :to="{ name: 'dashboard-users-permissions' }">
          <Btn type="builders">
            {{ $t('dashboard.manageRoles') }}
          </Btn>
        </NuxtLink>
      </div>

      <!-- Delete project -->
      <template v-if="settingsStore.isUserOwner()">
        <n-h5 class="mb-0" prefix="bar">{{ $t('project.delete') }}</n-h5>
        <p class="mb-6">{{ $t('project.deleteText') }}</p>
        <Btn type="primary">{{ $t('project.deleteRequest') }}</Btn>
      </template>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const settingsStore = useSettingsStore();

useHead({
  title: $i18n.t('nav.projectSettings'),
});
</script>
