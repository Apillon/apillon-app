<template>
  <div v-if="loading" class="flex flex-col gap-8" style="height: calc(100vh - 88px)">
    <!-- Loading skeleton - on long page load show skeleten -->
    <n-skeleton height="40px" width="100%" />
    <n-skeleton height="40px" width="100%" />
    <div class="flex gap-8 h-full">
      <div style="width: 100%">
        <n-skeleton height="100%" width="100%" />
      </div>
      <div style="width: 320px">
        <n-skeleton height="400px" width="100%" />
      </div>
    </div>
  </div>
  <div v-else>
    <div v-if="$slots.heading" ref="headingRef">
      <slot name="heading"> </slot>
    </div>

    <div class="flex flex-auto w-full flex-col md:flex-row">
      <n-layout :has-sider="instructionsAvailable" sider-placement="right">
        <n-layout-content>
          <n-scrollbar y-scrollable :style="scrollStyle">
            <slot />
          </n-scrollbar>
        </n-layout-content>
        <n-layout-sider
          v-if="instructionsAvailable"
          :collapsed="learnCollapsed"
          collapse-mode="width"
          :collapsed-width="48"
          :width="356"
          content-style="padding-left: 32px;"
          @after-enter="handleOnUpdateCollapse(false)"
          @after-leave="handleOnUpdateCollapse(true)"
        >
          <div class="mb-2">
            <h6 v-if="!learnCollapsed" class="inline-block">
              {{ $t('general.learn') }}
            </h6>
            <button
              class="btn-collapse flex justify-center items-center w-8 h-7 float-right border-[1px] text-[10px]"
              @click="learnCollapsed = !learnCollapsed"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  d="M3.27273 5.45453V18.5454L12 12L3.27273 5.45453Z"
                  fill="#F0F2DA"
                  :class="learnCollapsed ? 'translate-x-[9px]' : 'translate-x-0'"
                />
                <path
                  d="M20.7271 18.5454V5.45453L11.9998 12L20.7271 18.5454Z"
                  fill="#F0F2DA"
                  :class="learnCollapsed ? '-translate-x-[9px]' : 'translate-x-0'"
                />
              </svg>
            </button>
          </div>

          <slot v-if="!learnCollapsed" name="learn">
            <learn-section />
          </slot>
        </n-layout-sider>
      </n-layout>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

defineProps({
  loading: { type: Boolean, default: false },
});

/** Global messages */
window.$message = useMessage();

/** Check if instructions are available (page has content and feature is enabled) */
const $slots = useSlots();
const dataStore = useDataStore();
const { isLg } = useScreen();
const { name } = useRoute();

/** Heading height */
const headingRef = ref<HTMLElement>();
const scrollStyle = computed(() => {
  console.log(headingRef.value?.clientHeight);
  return {
    maxHeight: `calc(100vh - ${120 + (headingRef.value?.clientHeight || 0)}px)`,
  };
});

/** Instructions load */
const key = computed(() => {
  return name?.toString() || '';
});

onMounted(async () => {
  // await getInstructions(key.value);
});

async function getInstructions(key: string) {
  if (!dataStore.hasInstructions(key)) {
    await dataStore.fetchInstructions(key);
  }
}

const instructionsAvailable = computed(() => {
  return (
    dataStore.hasInstructions(key.value) && isFeatureEnabled(Feature.INSTRUCTIONS) && isLg.value
  );
});

// Keep info about collapsible section learn in local storage
const learnCollapsed = ref<boolean>(localStorage.getItem('learnCollapsed') === '1' || false);

function handleOnUpdateCollapse(value: boolean) {
  localStorage.setItem('learnCollapsed', value ? '1' : '0');
}
</script>

<style lang="postcss">
.btn-collapse > svg path {
  transition: all 0.5s;
}
</style>
