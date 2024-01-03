<template>
  <div id="grill" class="h-screen"></div>
</template>

<script lang="ts" setup>
import grill from '@subsocial/grill-widget';

const chatStore = useChatStore();

onMounted(() => {
  grill.init(chatStore.settings);
});

watch(
  () => chatStore.settings,
  (newSettings, oldSettings) => {
    if (oldSettings && newSettings && JSON.stringify(oldSettings) !== JSON.stringify(newSettings)) {
      grill.setConfig(newSettings);
    }
  }
);
</script>
