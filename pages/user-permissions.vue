<template>
  <Dashboard>
    <template #sidebar>
      <SidebarProjectSettings />
    </template>
    <slot>
      <div class="mb-2">
        <!-- Project users & permissions -->
        <h4 class="mb-6">{{ $t('dashboard.projectUsersAndPermissions') }}</h4>
        <TableUsersPermissions />

        <!-- Invite team member -->
        <n-h5 prefix="bar">{{ $t('dashboard.inviteTeamMember') }}</n-h5>
        <FormUserInvite />
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
