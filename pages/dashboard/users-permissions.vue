<template>
  <Dashboard>
    <template #sidebar>
      <SidebarProjectSettings />
    </template>
    <slot>
      <!-- Project users & permissions -->
      <h4 class="mb-6">{{ $t('project.usersAndPermissions') }}</h4>
      <TableUsersPermissions />

      <!-- Invite team member -->
      <template v-if="settingsStore.isUserOwner()">
        <n-h5 prefix="bar">{{ $t('dashboard.inviteTeamMember') }}</n-h5>
        <FormUserInvite />
      </template>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const settingsStore = useSettingsStore();

useHead({
  title: t('project.usersAndPermissions'),
});
</script>
