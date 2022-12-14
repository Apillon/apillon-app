<template>
  <n-alert :theme-overrides="alertLearnOverrides">
    <template #icon> <span class="icon-tip"></span> </template>
    <slot></slot>
  </n-alert>
</template>

<script lang="ts" setup>
import colors from '~~/tailwind.colors';

const alertLearnOverrides = {
  color: colors.transparent,
  iconColor: colors.primary,
  titleTextColor: colors.grey.light,
  border: `1px solid ${colors.grey.DEFAULT}`,
};
</script>
