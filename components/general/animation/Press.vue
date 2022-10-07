<template>
  <div class="flex items-center">
    <NuxtIcon :name="iconName" class="animation-press text-[340px]" fill />
  </div>
</template>

<script lang="ts" setup>
const icons = ['Press1', 'Press2', 'Press3', 'Press4', 'Press5', 'Press6'];
const iconIndex = ref<number>(0);
const iconName = computed(() => {
  return `AnimationPress${icons[iconIndex.value]}`;
});

setInterval(() => {
  iconIndex.value = iconIndex.value === icons.length - 1 ? 0 : iconIndex.value + 1;
}, 300);
</script>

<style lang="postcss">
.animation-press > svg {
  width: 100%;
}
</style>
