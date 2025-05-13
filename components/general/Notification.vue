<template>
  <div class="card-dark flex gap-2 rounded-lg p-3 text-sm text-white-secondary" :class="notificationClass">
    <NuxtIcon v-if="!hideIcon && alert" name="icon/alert" class="text-xl" filled />
    <span v-else-if="!hideIcon" class="text-xl" :class="iconClass"></span>
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: { type: String as PropType<TagType>, default: 'success' },
  hideIcon: { type: Boolean, default: false },
  alert: { type: Boolean, default: false },
});

const notificationClass = computed(() => {
  return [
    {
      'border-blue': props.type === 'info',
      'border-yellow': props.type === 'warning',
      'border-pink': props.type === 'error',
      'border-green': props.type === 'success',
    },
  ];
});

const iconClass = computed(() => {
  return [
    {
      'text-blue icon-info': props.type === 'info',
      'text-yellow icon-info': props.type === 'warning',
      'text-pink icon-info': props.type === 'error',
      'text-green icon-check': props.type === 'success',
    },
  ];
});
</script>
