<template>
  <div class="flex overflow-hidden px-4 font-bold">
    <div :class="$style.cornerTopLeft"></div>
    <div
      class="relative inline-block w-auto rounded-b-2xl border-1 border-t-0 bg-bg-dark px-8 py-1 text-sm"
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
  @apply relative z-1 h-4 w-4 overflow-hidden;

  &:before {
    @apply absolute block border-1 border-yellow;
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
    @apply right-0 top-0;
    box-shadow: 1rem -1rem 0 0 theme(colors.bg.dark);
  }
}

.cornerTopRight {
  @apply right-[1.3px];

  &:before {
    @apply left-0 top-0;
    box-shadow: -1rem -1rem 0 0 theme(colors.bg.dark);
  }
}
</style>
