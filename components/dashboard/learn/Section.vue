<template>
  <LearnAlert v-if="instructionHelper" v-bind="instructionHelper" />
  <LearnVideo v-if="instructionVideo" v-bind="instructionVideo" />
  <LearnCollapse v-if="instructionQa" :instructions="instructionQa" />
</template>

<script lang="ts" setup>
import { useDataStore } from '~~/stores/data';

const dataStore = useDataStore();
const { name } = useRoute();

const key = computed(() => {
  return name?.toString() || '';
});

const instructionHelper = computed<InstructionInterface | undefined>(() => {
  if (key.value in dataStore.instructions) {
    return dataStore.instructions[key.value].find(
      item => item.instructionType === InstructionType.HELPER
    );
  }
  return undefined;
});
const instructionVideo = computed<InstructionInterface | undefined>(() => {
  if (key.value in dataStore.instructions) {
    return dataStore.instructions[key.value].find(
      item => item.instructionType === InstructionType.VIDEO
    );
  }
  return undefined;
});
const instructionQa = computed<Array<InstructionInterface>>(() => {
  if (key.value in dataStore.instructions) {
    return dataStore.instructions[key.value].filter(
      item => item.instructionType === InstructionType.QA
    );
  }
  return [];
});
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
