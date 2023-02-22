<template>
  <strong
    class="w-5 h-5 leading-[18px] text-xs rounded-full border-1 text-center"
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
