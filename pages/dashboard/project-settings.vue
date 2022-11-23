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
        <n-button type="primary" quaternary>
          {{ $t('dashboard.manageRoles') }}
        </n-button>
      </div>

      <!-- Delete project -->
      <n-h5 class="mb-0" prefix="bar">{{ $t('project.delete') }}</n-h5>
      <p class="mb-6">{{ $t('project.deleteText') }}</p>
      <Btn type="primary">{{ $t('project.deleteRequest') }}</Btn>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  title: t('nav.projectSettings'),
});
</script>
