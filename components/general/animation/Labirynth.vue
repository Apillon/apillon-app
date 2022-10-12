<template>
  <div class="flex items-center">
    <NuxtIcon :name="iconName" class="animation-labirynth text-blue text-[140px]" fill />
  </div>
</template>

<script lang="ts" setup>
const icons = ['1', '2', '3', '4', '5', '6', '7', '8'];
const iconIndex = ref<number>(0);
const iconName = computed(() => {
  return `AnimationLabirynth${icons[iconIndex.value]}`;
});

setInterval(() => {
  iconIndex.value = iconIndex.value === icons.length - 1 ? 0 : iconIndex.value + 1;
}, 300);
</script>

<style lang="postcss">
.animation-labirynth > svg {
  width: 100%;

  rect {
    width: 100%;
    height: 100%;
  }
}
</style>
