<template>
  <n-alert :theme-overrides="alertLearnOverrides" class="mb-4">
    <template #icon> <span class="icon-tip"></span> </template>
    <slot>
      <div v-if="htmlContent" v-html="htmlContent"></div>
      <div v-else-if="extendedHtmlContent" v-html="extendedHtmlContent"></div>
    </slot>
  </n-alert>
</template>

<script lang="ts" setup>
import { colors } from '~/tailwind.config';

defineProps({
  title: { type: String, default: '' },
  htmlContent: { type: String, default: '' },
  extendedHtmlContent: { type: String, default: '' },
});

const alertLearnOverrides = {
  color: colors.transparent,
  iconColor: colors.primary,
  titleTextColor: colors.white.DEFAULT,
  border: `1px solid ${colors.body}`,
};
</script>
