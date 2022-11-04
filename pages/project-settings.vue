<template>
  <Dashboard>
    <template #sidebar>
      <SidebarProjectSettings />
    </template>
    <slot>
      <div class="mb-2">
        <h4 class="mb-6">{{ $t('dashboard.mySettings') }}</h4>

        <!-- Edit project -->
        <FormProjectSettings />

        <!-- Porject owner -->
        <n-h5 prefix="bar">{{ $t('dashboard.projectOwner') }}</n-h5>
        <TableProjectOwner />
        <div class="text-right">
          <n-button type="primary" quaternary>
            {{ $t('dashboard.manageRoles') }}
          </n-button>
        </div>

        <!-- Delete project -->
        <n-h5 class="mb-0" prefix="bar">{{ $t('dashboard.deleteProject') }}</n-h5>
        <p class="mb-6">{{ $t('dashboard.deleteProjectText') }}</p>
        <Btn type="primary">{{ $t('dashboard.sendRequestToDeleteProject') }}</Btn>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({
  title: t('dashboard.mySettings'),
});
</script>
