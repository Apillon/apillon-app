<template>
  <n-select v-bind="$attrs" :theme-overrides="SelectRoleOverrides">
    <template #arrow>
      <span class="icon-down text-3xl"></span>
    </template>
  </n-select>
</template>

<script lang="ts" setup>
import type { SelectProps } from 'naive-ui';

/** Theme override */
type SelectThemeOverrides = NonNullable<SelectProps['themeOverrides']>;
const SelectRoleOverrides: SelectThemeOverrides = {
  peers: {
    InternalSelection: {
      paddingSingle: '0 20px',
    },
  },
};
</script>
