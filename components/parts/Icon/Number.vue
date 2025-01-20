<template>
  <strong
    class="inline-flex-cc w-6 h-6 leading-5 text-xs rounded-full border-1"
    :class="iconClasses"
  >
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
