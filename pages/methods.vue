<template>
  <Dashboard>
    <template #heading>
      <h4>Methods</h4>
    </template>
    <template #infobar> Infobar </template>
    <template #sidebar>
      <SidebarProjectPages />
      <!-- <ul>
        <li>
          <NuxtLink to="/methods">Methods</NuxtLink>
          <NuxtLink to="/api-keys">API keys</NuxtLink>
        </li>
      </ul> -->
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
      <TableWeb3Methods />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
useHead({
  title: 'Dashboard (Methods)',
});

// const { notification } = createDiscreteApi(['notification']);
// const notification = useNotification();
// notification.warning({
//   content: '...',
// });

// const message = useMessage();
// message.warning('...');

// export default defineComponent({
//   setup() {
//     const message = useMessage();
//     return [NMessageProvider, message];
//   },
// });
</script>
