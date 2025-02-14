<template>
  <span class="nuxt-icon icon-switcher inline-block px-2 text-[22px] sm:px-5">
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 120V0L80 60L0 120Z" :fill="statusColor(!value)" />
      <path d="M160 0V120L80 60L160 0Z" :fill="statusColor(value)" />
    </svg>
  </span>
</template>

<script lang="ts" setup>
import { colors } from '~/tailwind.config';

defineProps({
  value: { type: Boolean, default: false },
});

function statusColor(on: boolean) {
  return on ? colors.blue : colors.white.DEFAULT;
}
</script>

<style lang="postcss">
.icon-switcher path {
  transition: all 0.3s;
}
</style>
