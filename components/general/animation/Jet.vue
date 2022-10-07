<template>
  <div class="flex items-center">
    <NuxtIcon :name="iconName" class="animation-jet text-[340px]" fill />
  </div>
</template>

<script lang="ts" setup>
const icons = ['Jet1', 'Jet2', 'Jet3', 'Jet4'];
const iconIndex = ref<number>(0);
const iconName = computed(() => {
  return `AnimationJet${icons[iconIndex.value]}`;
});

setInterval(() => {
  iconIndex.value = iconIndex.value === icons.length - 1 ? 0 : iconIndex.value + 1;
}, 300);
</script>

<style lang="postcss">
.animation-jet > svg {
  width: 100%;
}
</style>
