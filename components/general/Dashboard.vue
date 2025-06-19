<template>
  <div v-if="loading">
    <transition name="fade" appear>
      <div v-if="loadingAnimation" class="flex w-full flex-col gap-8" style="height: calc(100dvh - 56px)">
        <div
          class="-mx-4 h-24 px-4 text-sm sm:-mx-8 sm:px-8"
          :class="{ 'bg-bg-light/65': dataStore.project.selected }"
        ></div>
        <!-- Loading skeleton - on long page load show skeleton -->
        <n-skeleton height="40px" width="100%" />
        <n-skeleton height="40px" width="100%" />
        <div class="flex h-full gap-8">
          <div style="width: 100%">
            <n-skeleton height="80%" width="100%" />
          </div>
          <div style="width: 320px">
            <n-skeleton height="80%" width="100%" />
          </div>
        </div>
      </div>
    </transition>
  </div>
  <div v-else-if="empty && $slots.empty">
    <slot name="empty"> </slot>
  </div>
  <div v-else>
    <div v-if="$slots.heading" ref="headingRef">
      <slot name="heading"> </slot>
    </div>

    <div class="flex w-full flex-auto flex-col md:flex-row" :class="{ [$style.mainnet]: mainnet }">
      <div v-if="mainnet" class="absolute top-0 w-full">
        <Tag class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full px-1 text-[10px]" color="violet">
          MAINNET
        </Tag>
      </div>
      <n-layout class="has-scrollbar" sider-placement="right" :has-sider="sidebarVisible && isMd">
        <n-layout-content>
          <n-scrollbar y-scrollable :style="sidebarVisible || fullHeight ? {} : scrollStyle">
            <div class="pt-8" :style="fullHeight ? heightScreen : {}">
              <slot />
            </div>

            <slot v-if="sidebarVisible && !isMd" name="learn" class="mt-8"> </slot>

            <!-- Global component: File upload list -->
            <FormStorageUploadFiles
              v-if="(bucketStore.uploadActive && bucketStore.bucketUuid) || bucketStore.uploadFileList.length > 0"
              :bucket-uuid="bucketStore.bucketUuid"
            />

            <!-- Global component: Spending warning -->
            <ModalSpendingWarning v-model:show="warningStore.isSpendingWarningOpen" @close="onSpendingWaningClose" />

            <!-- Global component: deployment progress -->
            <StatusCard v-if="activeDeployments.length > 0" />
          </n-scrollbar>
        </n-layout-content>
        <n-layout-sider v-if="sidebarVisible && isMd" :width="isXl ? 455 : 356" content-style="padding-left: 20px;">
          <div class="h-full py-8">
            <slot name="learn" />
          </div>
        </n-layout-sider>
      </n-layout>
    </div>

    <div v-if="$slots.footer" ref="footerRef" class="-mx-4 sm:-mx-8">
      <slot name="footer"> </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  empty: { type: Boolean, default: false },
  fullHeight: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  learnCollapsible: { type: Boolean, default: false },
  mainnet: { type: Boolean, default: false },
});

/** Check if instructions are available (page has content and feature is enabled) */
const $slots = useSlots();
const authStore = useAuthStore();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const warningStore = useWarningStore();
const { activeDeployments } = useRefreshStatus();

const { isMd, isXl } = useScreen();

/** Heading height */
const headingRef = ref<HTMLElement>();
const footerRef = ref<HTMLElement>();

const calcHeaderHeight = () => (headingRef.value?.clientHeight || 96) + 56;
const calcFooterHeight = () => Number(footerRef.value?.clientHeight || 0);

const headingHeight = ref<number>(calcHeaderHeight());
const footerHeight = ref<number>(calcFooterHeight());

const scrollStyle = computed(() => ({
  maxHeight: `calc(100dvh - ${headingHeight.value}px - ${footerHeight.value}px)`,
}));
const heightScreen = computed(() => ({
  height: `calc(100dvh - ${headingHeight.value}px - ${footerHeight.value}px)`,
}));

/** Delay animation */
const loadingAnimation = ref<boolean>(false);
onMounted(() => {
  setLoadingAnimation(props.loading);

  if (!sessionStorage.getItem(LsAnalyticsKeys.USER_UUID)) {
    trackEvent('dashboard_on_load', {
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
    headingHeight.value = calcHeaderHeight();
    footerHeight.value = calcFooterHeight();
  }, delay);
}

const sidebarVisible = computed<boolean>(() => {
  return !!$slots.learn;
});

/** Warnings */
function onSpendingWaningClose() {
  warningStore.services = [];
  warningStore.isSpendingWarningOpen = false;
}
</script>

<style lang="postcss">
.btn-collapse > svg path {
  transition: all 0.5s;
}
</style>
<style lang="postcss" module>
.mainnet {
  @apply relative -mt-[2px] py-[1px];

  &:before {
    content: '';
    @apply absolute -left-8 -right-8 bottom-0 top-0 border border-violet;
  }
}
</style>
