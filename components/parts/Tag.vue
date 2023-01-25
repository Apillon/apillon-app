<template>
  <strong v-bind="$attrs" class="inline-block transition-all duration-300" :class="tagClass">
    <slot />
  </strong>
</template>

<script lang="ts" setup>
const props = defineProps({
  color: {
    type: String,
    validator: (type: string) => ['yellow', 'green', 'pink', 'violet', 'blue'].includes(type),
    default: 'blue',
  },
  onHover: { type: Boolean, default: false },
});

const tagClass = computed(() => {
  if (props.onHover) {
    switch (props.color) {
      case 'yellow':
        return 'text-yellow hover:bg-yellow hover:text-bg';
      case 'green':
        return 'text-green hover:bg-green hover:text-bg';
      case 'pink':
        return 'text-pink hover:bg-pink hover:text-bg';
      case 'violet':
        return 'text-violet hover:bg-violet hover:text-bg';
      case 'blue':
        return 'text-blue hover:bg-blue hover:text-bg';
      default:
        return 'text-blue hover:bg-blue hover:text-bg';
    }
  }
  switch (props.color) {
    case 'yellow':
      return 'bg-yellow text-bg';
    case 'green':
      return 'bg-green text-bg';
    case 'pink':
      return 'bg-pink text-bg';
    case 'violet':
      return 'bg-violet text-bg';
    case 'blue':
      return 'bg-blue text-bg';
    default:
      return 'bg-blue text-bg';
  }
});
</script>
