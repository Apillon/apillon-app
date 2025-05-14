<template>
  <span class="icon-status align-text-bottom text-xl" :class="statusClass"></span>
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
