<template>
  <!-- NOTICE -->
  <div
    class="flex h-[48px] w-full flex-row items-center justify-center p-4 text-sm text-bg-dark"
    :class="notificationClass"
  >
    <strong class="text-center">
      <slot />
    </strong>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    validator: (value: string) => ['info', 'error', 'warning', 'success'].includes(value),
    default: 'success',
  },
});

const $style = useCssModule();

const notificationClass = computed(() => {
  return [
    {
      'bg-blue': props.type === 'info',
      'bg-yellow': props.type === 'warning',
      'bg-pink': props.type === 'error',
      'bg-green': props.type === 'success',
    },
  ];
});
</script>
