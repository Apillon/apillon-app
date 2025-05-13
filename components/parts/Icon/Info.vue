<template>
  <n-tooltip v-if="tooltip" v-bind="$attrs" :trigger="isMd ? 'hover' : 'click'">
    <template #trigger>
      <n-button
        class="px-1 align-sub"
        :size="size === 'sm' ? 'tiny' : size === 'md' ? 'small' : 'large'"
        type="tertiary"
        tabindex="-1"
        quaternary
        round
      >
        <span class="icon-info" :class="size === 'sm' ? 'text-base' : size === 'md' ? 'text-xl' : 'text-2xl'"></span>
      </n-button>
    </template>
    <slot>{{ tooltip }}</slot>
  </n-tooltip>
  <n-button
    v-else
    v-bind="$attrs"
    class="px-1 align-sub"
    :size="size === 'sm' ? 'tiny' : size === 'md' ? 'small' : 'large'"
    type="tertiary"
    tabindex="-1"
    quaternary
    round
  >
    <span class="icon-info" :class="size === 'sm' ? 'text-base' : size === 'md' ? 'text-xl' : 'text-2xl'"></span>
  </n-button>
</template>

<script lang="ts" setup>
defineProps({
  size: {
    type: String,
    validator: (type: string) => ['sm', 'md', 'lg'].includes(type),
    default: 'md',
  },
  tooltip: {
    type: String,
    default: '',
  },
});
const { isMd } = useScreen();
</script>
