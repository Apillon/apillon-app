<template>
  <n-alert :theme-overrides="alertLearnOverrides">
    <template #icon> <span class="icon-tip"></span> </template>
    <slot></slot>
  </n-alert>
</template>

<script lang="ts" setup>
import { NAlert } from 'naive-ui';
import colors from '../../../tailwind.colors';

const alertLearnOverrides = {
  color: colors.white,
  iconColor: colors.primary,
  border: `1px solid ${colors.primary}`,
};
</script>
