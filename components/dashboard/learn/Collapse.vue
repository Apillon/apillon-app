<template>
  <n-collapse class="collapse-learn" arrow-placement="right">
    <template #header-extra>
      <span class="text-primary">{{ $t('general.learnMore') }}</span>
    </template>
    <n-collapse-item
      v-if="instruction"
      :key="instruction.id"
      :title="instruction.title"
      :name="instruction.id"
    >
      <div v-html="instruction.htmlContent"></div>
      <div v-html="instruction.extendedHtmlContent"></div>
      <a v-if="instruction.docsUrl" :href="instruction.docsUrl" target="_blank">
        {{ instruction.docsUrl }}
      </a>
    </n-collapse-item>
  </n-collapse>

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
      <a v-if="item.docsUrl" :href="item.docsUrl" target="_blank">
        {{ item.docsUrl }}
      </a>
    </n-collapse-item>
  </n-collapse>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useDataStore } from '~~/stores/data';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const { name } = useRoute();

const key = computed(() => {
  return name?.toString() || '';
});

const instruction = computed<InstructionInterface>(() => {
  if (key.value in dataStore.instruction) {
    return dataStore.instruction[key.value];
  }
  return null;
});

const instructions = computed<Array<InstructionInterface>>(() => {
  if (key.value in dataStore.instructions) {
    return dataStore.instructions[key.value];
  }
  return null;
});

onMounted(async () => {
  await getInstruction(key.value);
  // await getInstructions(key: string);
});

async function getInstruction(key: string) {
  if (key in dataStore.instruction) {
    return;
  }

  try {
    const params = { instructionEnum: key };
    const res = await $api.get<InstructionResponse>(endpoints.instruction, params);

    if (res.data) {
      dataStore.instruction[key] = res.data;
    }
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
}
async function getInstructions(key: string) {
  if (key in dataStore.instructions) {
    return;
  }

  try {
    const params = { forRoute: key };
    const res = await $api.get<InstructionsResponse>(endpoints.instruction, params);

    if (res.data) {
      dataStore.instructions[key] = res.data.items;
    }
  } catch (error) {
    message.error(userFriendlyMsg(error, $i18n));
  }
}
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
