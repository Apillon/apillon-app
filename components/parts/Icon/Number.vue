<template>
  <strong class="inline-flex-cc h-6 w-6 rounded-full border-1 text-xs leading-5" :class="iconClasses">
    {{ number }}
  </strong>
</template>

<script lang="ts" setup>
const props = defineProps({
  number: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
});

const iconClasses = computed(() => {
  return [props.active ? 'text-bg bg-white border-white' : 'text-bodyDark border-bodyDark'];
});
</script>
