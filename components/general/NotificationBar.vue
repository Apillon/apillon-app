<template>
  <div class="px-4 overflow-hidden flex font-bold">
    <div :class="$style.cornerTopLeft"></div>
    <div
      class="relative inline-block py-1 px-8 border-1 border-t-0 rounded-b-2xl w-auto bg-bg-dark text-sm"
      :class="notificationClass"
    >
      <slot />
    </div>
    <div :class="$style.cornerTopRight"></div>
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
    $style.notification,
    {
      'border-blue': props.type === 'info',
      'border-yellow': props.type === 'warning',
      'border-pink': props.type === 'error',
      'border-green': props.type === 'success',
    },
  ];
});
</script>

<style lang="postcss" module>
.cornerTopLeft,
.cornerTopRight {
  @apply w-4 h-4 relative overflow-hidden z-1;

  &:before {
    @apply block absolute border-1 border-yellow;
    content: '';
    display: block;
    width: 200%;
    height: 200%;
    border-radius: 50%;
  }
}
.cornerTopLeft {
  @apply left-[1.5px];

  &:before {
    @apply top-0 right-0;
    box-shadow: 1rem -1rem 0 0 theme(colors.bg.dark);
  }
}

.cornerTopRight {
  @apply right-[1.3px];

  &:before {
    @apply top-0 left-0;
    box-shadow: -1rem -1rem 0 0 theme(colors.bg.dark);
  }
}
</style>
