<template>
  <strong v-bind="$attrs" class="inline-block text-bg" :class="tagClass">
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
});

const tagClass = computed(() => {
  switch (props.color) {
    case 'yellow':
      return 'bg-yellow';
    case 'green':
      return 'bg-green';
    case 'pink':
      return 'bg-pink';
    case 'violet':
      return 'bg-violet';
    case 'blue':
      return 'bg-blue';
    default:
      return 'bg-blue';
  }
});
</script>
