<template>
  <div v-if="loading">
    <transition name="fade" appear>
      <div
        v-if="loadingAnimation"
        class="w-full flex flex-col gap-8"
        style="height: calc(100vh - 88px)"
      >
        <!-- Loading skeleton - on long page load show skeleton -->
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
    </transition>
  </div>
  <div v-else>
    <div v-if="$slots.heading" ref="headingRef">
      <slot name="heading"> </slot>
    </div>

    <div class="flex flex-auto w-full flex-col md:flex-row">
      <n-layout
        class="has-scrollbar"
        :has-sider="instructionsAvailable && isMd"
        sider-placement="right"
      >
        <n-layout-content>
          <n-scrollbar y-scrollable :style="scrollStyle">
            <div class="pt-8">
              <slot />
            </div>

            <slot v-if="instructionsAvailable && !isMd" name="learn" class="mt-8">
              <learn-section />
            </slot>

            <!-- Global component: File upload list -->
            <FormStorageUploadFiles
              v-if="bucketStore.uploadActive && bucketStore.bucketUuid"
              :bucket-uuid="bucketStore.bucketUuid"
            />

            <!-- Global component: Spending warning -->
            <ModalSpendingWarning
              v-model:show="warningStore.isSpendingWarningOpen"
              @close="warningStore.isSpendingWarningOpen = false"
            />
          </n-scrollbar>
        </n-layout-content>
        <n-layout-sider
          v-if="instructionsAvailable && isMd"
          :collapsed="learnCollapsed"
          collapse-mode="width"
          :collapsed-width="48"
          :width="isXl ? 455 : 356"
          :content-style="isMd ? 'padding-left: 32px;' : ''"
          @after-enter="handleOnUpdateCollapse(false)"
          @after-leave="handleOnUpdateCollapse(true)"
        >
          <template v-if="learnCollapsible">
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

            <slot v-if="!learnCollapsed && isMd" name="learn">
              <learn-section />
            </slot>
          </template>
          <template v-else>
            <slot v-if="!learnCollapsed && isMd" name="learn">
              <learn-section />
            </slot>
          </template>
        </n-layout-sider>
      </n-layout>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGtm } from '@gtm-support/vue-gtm';
const props = defineProps({
  loading: { type: Boolean, default: false },
  learnCollapsible: { type: Boolean, default: true },
});

/** Check if instructions are available (page has content and feature is enabled) */
const $slots = useSlots();
const authStore = useAuthStore();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const warningStore = useWarningStore();
const paymentsStore = usePaymentsStore();

const gtm = useGtm();
const { isMd, isLg, isXl } = useScreen();
const { name } = useRoute();

/** Heading height */
const headingRef = ref<HTMLElement>();
const scrollStyle = computed(() => {
  return {
    maxHeight: `calc(100vh - ${120 + (headingRef.value?.clientHeight || 0)}px)`,
  };
});

/** Delay animation */
const loadingAnimation = ref<boolean>(false);
onMounted(() => {
  setLoadingAnimation(props.loading);
  // await getInstructions(key.value);

  /** Get Price list */
  paymentsStore.getPriceList();

  if (gtm && gtm.enabled() && !sessionStorage.getItem(LsAnalyticsKeys.USER_UUID)) {
    gtm.trackEvent({
      event: 'dashboard_on_load',
      user_uuid: authStore.userUuid,
    });
    sessionStorage.setItem(LsAnalyticsKeys.USER_UUID, Date.now().toString());
  }
});
watch(
  () => props.loading,
  isLoading => {
    setLoadingAnimation(isLoading);
  }
);
function setLoadingAnimation(isLoading: boolean) {
  const delay = isLoading ? 10 : 0;
  setTimeout(() => {
    loadingAnimation.value = isLoading;
  }, delay);
}

/** Instructions load */
const key = computed(() => {
  return name?.toString() || '';
});

async function getInstructions(key: string) {
  if (!dataStore.hasInstructions(key)) {
    await dataStore.fetchInstructions(key);
  }
}

const instructionsAvailable = computed<boolean>(() => {
  return (
    (dataStore.hasInstructions(key.value) &&
      isFeatureEnabled(Feature.INSTRUCTIONS, authStore.getUserRoles()) &&
      isLg.value) ||
    !!$slots.learn
  );
});

// Keep info about collapsible section learn in local storage
const learnCollapsed = ref<boolean>(
  props.learnCollapsible && localStorage.getItem('learnCollapsed') === '1'
);

function handleOnUpdateCollapse(value: boolean) {
  localStorage.setItem('learnCollapsed', value ? '1' : '0');
}
</script>

<style lang="postcss">
.btn-collapse > svg path {
  transition: all 0.5s;
}
</style>
