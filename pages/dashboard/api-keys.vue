<template>
  <Dashboard>
    <template #heading>
      <h4>Title</h4>
    </template>
    <template #infobar> Infobar </template>
    <template #sidebar>
      <SidebarProjectPages />
    </template>
    <template #learn>
      <LearnAlert>
        Click on a service you want to attach to your project. After configuring it, the service
        will become operational.
        <strong>Keep in mind, you can always edit the attached services or add new ones.</strong>
      </LearnAlert>
      <LearnClientLibraries />
    </template>
    <slot>
      <TableSecrets />
      <div class="text-right">
        <NuxtLink to="credentials">
          <n-button type="primary" quaternary>
            {{ $t('dashboard.goToApiManagement') }}
          </n-button>
        </NuxtLink>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
useHead({
  title: 'API keys',
});
</script>
