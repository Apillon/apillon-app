<template>
  <div
    class="inline-block py-2 pl-5 pr-3 border-l-4 bg-grey-lightBg"
    :class="[`text-${colorClass}`, `border-color-${colorClass}`]"
  >
    <span :class="iconClass"></span>
    <slot />
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

const iconClass = computed(() => {
  return [
    $style.notification,
    {
      'text-blue icon-info': props.type === 'info',
      'text-yellow icon-info': props.type === 'warning',
      'text-pink icon-close': props.type === 'error',
      'text-green icon-check': props.type === 'success',
    },
  ];
});

const colorClass = computed(() => {
  switch (props.type) {
    case 'info':
      return 'blue';
    case 'warning':
      return 'yellow';
    case 'error':
      return 'pink';
    default:
      return 'green';
  }
});
</script>

<style lang="postcss" module>
.notification {
  @apply mr-2 align-middle text-xl;
}
</style>
