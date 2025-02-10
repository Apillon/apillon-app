<template>
  <div v-if="settingsStore.notifications.loading" class="relative h-8 w-8">
    <Spinner />
  </div>
  <n-dropdown
    v-else
    class="scrollable max-h-96 min-w-48 overflow-y-auto rounded-lg lg:min-w-96 xl:max-h-[60vh]"
    placement="bottom-end"
    trigger="click"
    :key="settingsStore.notifications.items.length"
    :options="options"
    :render-option="renderOption"
    @select="handleSelect"
  >
    <div class="cursor-pointer p-2 text-blue">
      <NuxtIcon name="dashboard/bell" class="text-lg" />
    </div>
  </n-dropdown>
</template>

<script lang="ts" setup>
const settingsStore = useSettingsStore();

onMounted(() => {
  settingsStore.getNotifications();
});

const options = computed(() => {
  if (settingsStore.notificationsToShow.length === 0) {
    return [
      { key: 'empty', label: '' },
      { key: 'footer', label: '' },
    ];
  }
  const notifications = settingsStore.notificationsToShow.map(n => ({
    key: n.id,
    label: n.message,
    notification: n,
  }));
  return [
    ...notifications,
    {
      key: 'footer',
      label: '',
    },
  ];
});

function renderOption({ node, option }) {
  if (option?.key === 'empty') {
    return h(resolveComponent('HeaderNotificationEmpty'));
  }
  if (option?.key === 'footer') {
    return h(resolveComponent('HeaderNotificationFooter'));
  }
  return h(resolveComponent('HeaderNotification'), {
    notification: option.notification,
  });
}

function handleSelect(key: string | number) {
  console.log(key);
}
</script>
