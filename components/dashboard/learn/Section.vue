<template>
  <LearnAlert v-if="instructionHelper" v-bind="instructionHelper" />
  <LearnVideo v-if="instructionVideo" v-bind="instructionVideo" />
  <LearnCollapse v-if="instructionQa" :instructions="instructionQa" />
</template>

<script lang="ts" setup>
const dataStore = useDataStore();
const { name } = useRoute();

const key = computed(() => {
  return name?.toString() || '';
});

const instructionHelper = computed<InstructionInterface | undefined>(() => {
  if (key.value in dataStore.instructions) {
    return dataStore.instructions[key.value].find(item => item.instructionType === InstructionType.HELPER);
  }
  return undefined;
});
const instructionVideo = computed<InstructionInterface | undefined>(() => {
  if (key.value in dataStore.instructions) {
    return dataStore.instructions[key.value].find(item => item.instructionType === InstructionType.VIDEO);
  }
  return undefined;
});
const instructionQa = computed<Array<InstructionInterface>>(() => {
  if (key.value in dataStore.instructions) {
    return dataStore.instructions[key.value].filter(item => item.instructionType === InstructionType.QA);
  }
  return [];
});
</script>

<style lang="postcss">
.n-collapse.collapse-learn {
  .n-collapse-item {
    @apply mt-2;

    .n-collapse-item__header {
      @apply h-11 bg-bg-lighter py-2 pl-4 pr-6 shadow-black;
    }
    .n-collapse-item-arrow {
      @apply absolute right-1 text-primary;
    }
  }
}
</style>
