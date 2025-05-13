<template>
  <Dashboard>
    <template #heading>
      <Heading>
        <slot>
          <div>
            <h2 class="whitespace-nowrap">{{ $t('dashboard.nav.projectSettings') }}</h2>
            <TableEllipsis :prefix="$t('project.uuid')" :text="dataStore.project.active.project_uuid" />
          </div>
        </slot>

        <template #info> </template>

        <template #submenu>
          <MenuProjectSettings />
        </template>
      </Heading>
    </template>

    <slot>
      <div class="pb-8">
        <!-- Edit project -->
        <FormProjectSettings />

        <!-- Project owner -->
        <n-h5 prefix="bar">{{ $t('project.owner') }}</n-h5>
        <TableProjectOwner />
        <div class="text-right">
          <Btn type="builders" :to="{ name: 'dashboard-users-permissions' }">
            {{ $t('dashboard.manageRoles') }}
          </Btn>
        </div>

        <!-- Delete project -->
        <template v-if="dataStore.isUserOwner && isFeatureEnabled(Feature.PROJECT_DELETE, authStore.getUserRoles())">
          <n-h5 class="mb-0" prefix="bar">{{ $t('project.delete') }}</n-h5>
          <p class="mb-6">{{ $t('project.deleteText') }}</p>
          <Btn type="primary">{{ $t('project.deleteRequest') }}</Btn>
        </template>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const authStore = useAuthStore();
const dataStore = useDataStore();

useHead({
  title: t('dashboard.nav.projectSettings'),
});
</script>
