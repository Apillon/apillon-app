<template>
  <n-collapse class="collapse-learn" arrow-placement="right">
    <template #header-extra>
      <span class="text-primary">{{ $t('general.learnMore') }}</span>
    </template>
    <n-collapse-item title="What is Kilt?" name="1">
      <div>Kilt</div>
    </n-collapse-item>
    <n-collapse-item title="How to attach service?" name="2">
      <div>Attach Service</div>
    </n-collapse-item>
    <n-collapse-item title="Hot it works?" name="3">
      <div>How it work</div>
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts" setup>
import { NCollapse, NCollapseItem } from 'naive-ui';
</script>

<style lang="postcss">
.n-collapse.collapse-learn {
  .n-collapse-item {
    @apply mt-2;

    .n-collapse-item__header {
      @apply h-11 pl-4 py-2 pr-6 bg-grey-lightBg shadow-black;
    }
    .n-collapse-item-arrow {
      @apply absolute right-1 text-primary;
    }
  }
}
</style>
