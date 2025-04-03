<template>
  <div class="sticky -bottom-4 -mx-2 mb-2 flex items-center justify-between bg-bg-dark px-5 py-2">
    <Btn v-if="showBtnReadAll" type="builders" @click="settingsStore.readAllNotifications()">
      <strong>Mark all as read</strong>
    </Btn>
    <div v-else></div>
    <div>
      <span class="text-sm">Only show unread</span>
      <n-switch v-model:value="settingsStore.notifications.showOnlyUnread" class="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const settingsStore = useSettingsStore();

const showBtnReadAll = computed(() => {
  return settingsStore.notifications.items.some(n => !settingsStore.notifications.read.includes(n.id));
});
</script>
