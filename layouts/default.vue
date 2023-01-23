<template>
  <div ref="mainContentRef" class="relative h-screen">
    <n-message-provider
      :to="messageRef"
      placement="bottom-right"
      :keep-alive-on-hover="true"
      :duration="3000"
      closable
    >
      <n-layout has-sider class="h-full">
        <n-layout-sider
          bordered
          show-trigger
          collapse-mode="width"
          :collapsed-width="64"
          :width="320"
          :native-scrollbar="false"
          style="max-height: 100vh"
        >
          <Sidebar :show-on-mobile="showMobileSidebar" @toggle-sidebar="toggleSidebar" />
        </n-layout-sider>
        <n-layout>
          <Header @toggleSidebar="toggleSidebar" />
          <n-scrollbar y-scrollable style="max-height: calc(100vh - 88px)">
            <div ref="messageRef" class="relative pt-8 px-4 sm:px-8">
              <slot />
            </div>
            <!-- <CookieConsent /> -->
          </n-scrollbar>
        </n-layout>
      </n-layout>
    </n-message-provider>
  </div>
</template>

<script lang="ts" setup>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

const { isLg } = useScreen();
const messageRef = ref<HTMLDivElement>();
const mainContentRef = ref<HTMLDivElement>();
const showMobileSidebar = ref<boolean>(false);

/**
 * Enable/disable body scroll
 */
onMounted(() => {
  disableBodyScroll(document.body as HTMLElement);
});

onUnmounted(() => {
  clearAllBodyScrollLocks();
});

/**
 * Show/hide sidebar on mobile
 */
const { lengthX, lengthY } = useSwipe(mainContentRef, {
  onSwipeEnd() {
    if (
      !isLg.value &&
      Math.abs(lengthX.value) > 150 &&
      Math.abs(lengthX.value) > Math.abs(lengthY.value)
    ) {
      /** Show sidebar if user swipe right otherwise close it   */
      toggleSidebar(lengthX.value < 0);
    }
  },
});

/** Hide sidebar if user flip devcie in mobile view */
watch(
  () => isLg.value,
  isLg => {
    toggleSidebar(isLg);
  }
);

function toggleSidebar(show?: boolean) {
  if (show === undefined) {
    showMobileSidebar.value = !showMobileSidebar.value;
  } else {
    showMobileSidebar.value = show;
  }
}
</script>
