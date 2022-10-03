<template>
  <Dashboard>
    <template #heading>
      <h4>Title</h4>
    </template>
    <template #infobar> Infobar </template>
    <template #sidebar> sidebar </template>
    <template #learn>
      <AlertLearn>
        Click on a service you want to attach to your project. After configuring it, the service
        will become operational.
        <strong>Keep in mind, you can always edit the attached services or add new ones.</strong>
      </AlertLearn>
      <ClientLibraries />
    </template>
    <slot> content </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

useHead({
  title: 'AuthTrail',
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
