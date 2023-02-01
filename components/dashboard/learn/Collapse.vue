<template>
  <n-collapse v-if="instructions" class="collapse-learn" arrow-placement="right">
    <template #header-extra>
      <span class="text-primary">{{ $t('general.learnMore') }}</span>
    </template>
    <n-collapse-item
      v-for="item in instructions"
      :key="item.id"
      :title="item.title"
      :name="item.id"
    >
      <div v-html="item.htmlContent"></div>
      <div v-html="item.extendedHtmlContent"></div>
      <a v-if="item.docsUrl" :href="item.docsUrl" class="mt-2 inline-block" target="_blank">
        {{ item.docsUrl }}
      </a>
      <div class="mb-6"></div>
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts" setup>
const props = defineProps({
  instructions: { type: Array<InstructionInterface>, default: [] },
});
</script>

<style lang="postcss">
.n-collapse.collapse-learn {
  .n-collapse-item {
    @apply mt-2;

    .n-collapse-item__header {
      @apply h-11 pl-4 py-2 pr-6 bg-white shadow-black;
    }
    .n-collapse-item-arrow {
      @apply absolute right-1 text-primary;
    }
  }
}
</style>
