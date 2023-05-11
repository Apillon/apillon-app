<template>
  <Dashboard>
    <template #heading>
      <Heading>
        <slot>
          <h4>{{ $t('dashboard.nav.projectSettings') }}</h4>
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
        <template
          v-if="
            settingsStore.isUserOwner() &&
            isFeatureEnabled(Feature.PROJECT_DELETE, authStore.getUserRoles())
          "
        >
          <n-h5 class="mb-0" prefix="bar">{{ $t('project.delete') }}</n-h5>
          <p class="mb-6">{{ $t('project.deleteText') }}</p>
          <Btn type="primary">{{ $t('project.deleteRequest') }}</Btn>
        </template>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();

useHead({
  title: $i18n.t('dashboard.nav.projectSettings'),
});
</script>
