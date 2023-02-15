<template>
  <span class="icon-status text-xl align-text-bottom" :class="statusClass"></span>
</template>

<script lang="ts" setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});

const statusClass = computed(() => {
  return [props.active ? 'text-green' : 'text-body/24'];
});
</script>
