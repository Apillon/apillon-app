<script lang="ts" setup>
defineProps({
  text: { type: [String, Boolean], default: false },
});
</script>

<template>
  <p v-if="text || !!$slots.default" class="text-xs leading-none text-red">
    <template v-if="text">
      {{ text }}
    </template>

    <slot v-else />
  </p>
</template>
