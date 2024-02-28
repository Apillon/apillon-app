<template>
  <div id="grill" class="h-full"></div>
</template>

<script lang="ts" setup>
import grill from '@subsocial/grill-widget';

const postStore = usePostStore();

onMounted(() => {
  grill.init(postStore.settings);
});

watch(
  () => postStore.settings,
  (newSettings, oldSettings) => {
    if (oldSettings && newSettings && JSON.stringify(oldSettings) !== JSON.stringify(newSettings)) {
      grill.setConfig(newSettings);
    }
  },
  {
    deep: true,
  }
);
</script>
