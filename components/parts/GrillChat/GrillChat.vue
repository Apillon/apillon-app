<template>
  <div id="grill" class="h-screen"></div>
</template>

<script lang="ts" setup>
import grill from '@subsocial/grill-widget';

const settingsStore = useSettingsStore();

const showChat = ref<boolean>(true);

onMounted(() => {
  grill.init(settingsStore.grillChatSettings);
});

watch(
  () => settingsStore.grillChatSettings,
  (newSettings, oldSettings) => {
    if (oldSettings && newSettings && JSON.stringify(oldSettings) !== JSON.stringify(newSettings)) {
      grill.setConfig(newSettings);
    }
  }
);
</script>
