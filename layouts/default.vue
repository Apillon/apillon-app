<template>
  <div ref="mainContentRef" class="relative h-screen lg:pl-64">
    <n-message-provider :to="messageRef" :keep-alive-on-hover="true" :duration="5000">
      <Sidebar :show-on-mobile="showMobileSidebar" @toggle-sidebar="toggleSidebar" />
      <Header @toggleSidebar="toggleSidebar" />
      <n-scrollbar class="bg-grey-dark" y-scrollable style="max-height: calc(100vh - 56px)">
        <HeaderTabs v-if="routeName === 'index'" />
        <div ref="messageRef" class="relative py-7 px-4 sm:px-8 lg:pr-10">
          <slot />
        </div>
        <!-- <CookieConsent /> -->
      </n-scrollbar>
    </n-message-provider>
  </div>
</template>

<script lang="ts" setup>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

const { isLg } = useScreen();
const messageRef = ref<HTMLDivElement>();
const mainContentRef = ref<HTMLDivElement>();
const showMobileSidebar = ref<boolean>(false);

const route = useRoute();
const routeName = computed(() => {
  return route.name;
});

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
