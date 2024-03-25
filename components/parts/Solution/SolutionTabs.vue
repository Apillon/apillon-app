<template>
  <n-tabs
    ref="mintTabsRef"
    v-model:value="currentTab"
    type="bar"
    :bar-width="0"
    size="large"
    animated
  >
    <n-tab-pane v-for="(component, key) in tabs" :key="key" :name="key">
      <template #tab>
        <IconSuccessful v-if="currentIndex > tabIndex(key)" />
        <IconNumber v-else :number="tabIndex(key) + 1" :active="currentTab === key" />
        <span class="ml-2 text-sm text-white">
          {{ $t(`dashboard.solutions.${solution}.tabs[${tabIndex(key)}]`) }}
        </span>
      </template>
      <slot>
        <component :is="component" />
      </slot>
    </n-tab-pane>
  </n-tabs>
  <div
    class="absolute left-0 right-0 bottom-0 h-[120px] flex items-center border-t border-bg-lighter"
  >
    <div class="w-full">
      <Btn
        v-if="currentIndex > 0"
        type="secondary"
        @click="$emit('change', Object.keys(tabs)[currentIndex - 1])"
      >
        {{ $t('form.goBack') }}</Btn
      >
      <Btn
        v-if="currentIndex < Object.keys(tabs).length - 1"
        class="float-right"
        type="primary"
        @click="$emit('change', Object.keys(tabs)[currentIndex + 1])"
      >
        {{ $t('form.proceed') }}
      </Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  solution: { type: String, required: true },
  tab: { type: String, required: true },
  tabs: { type: Object as PropType<Record<string, any>>, required: true },
});
defineEmits(['back', 'change', 'proceed']);

const currentTab = ref(props.tab);
const currentIndex = computed(() =>
  Object.keys(props.tabs).findIndex(item => item === currentTab.value)
);

watch(
  () => props.tab,
  newTab => {
    currentTab.value = newTab;
  }
);

function tabIndex(tabName: string) {
  return Object.keys(props.tabs).findIndex(item => item === tabName);
}
</script>
