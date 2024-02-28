<template>
  <n-tooltip v-if="tooltip" v-bind="$attrs" trigger="hover">
    <template #trigger>
      <n-button
        class="align-sub"
        :class="size === 'sm' ? 'px-1' : 'px-2'"
        :size="size === 'sm' ? 'tiny' : size === 'md' ? 'small' : 'large'"
        type="tertiary"
        tabindex="-1"
        quaternary
        round
      >
        <span
          class="icon-info"
          :class="size === 'sm' ? 'text-base' : size === 'md' ? 'text-2xl' : 'text-3xl'"
        ></span>
      </n-button>
    </template>
    {{ tooltip }}
  </n-tooltip>
  <n-button
    v-else
    v-bind="$attrs"
    class="align-sub"
    :class="size === 'sm' ? 'px-1' : 'px-2'"
    :size="size === 'sm' ? 'tiny' : size === 'md' ? 'small' : 'large'"
    type="tertiary"
    tabindex="-1"
    quaternary
    round
  >
    <span
      class="icon-info"
      :class="size === 'sm' ? 'text-base' : size === 'md' ? 'text-2xl' : 'text-3xl'"
    ></span>
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
</script>
