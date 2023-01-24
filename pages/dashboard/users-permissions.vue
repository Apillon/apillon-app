<template>
  <Dashboard>
    <template #heading>
      <Heading>
        <slot>
          <h4>{{ $t('project.usersAndPermissions') }}</h4>
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
const { t } = useI18n();
const settingsStore = useSettingsStore();

useHead({
  title: t('project.usersAndPermissions'),
});
</script>
