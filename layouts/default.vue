<template>
  <div v-if="!authStore.loadingProfile" ref="mainContentRef" class="relative h-screen">
    <n-layout class="h-full" :has-sider="isLg" sider-placement="left">
      <n-layout-sider
        v-if="isLg"
        :show-trigger="true"
        :collapsed="sidebarCollapsed"
        :collapsed-width="72"
        collapse-mode="width"
        :width="320"
        :native-scrollbar="false"
        bordered
        style="max-height: 100dvh"
        @update-collapsed="onCollapse"
      >
        <Sidebar :collapsed="sidebarCollapsed" />
      </n-layout-sider>
      <n-layout>
        <Header @toggle-sidebar="toggleSidebar" />
        <n-scrollbar y-scrollable style="max-height: calc(100dvh - 88px)">
          <div class="relative pt-8 px-4 sm:px-8">
            <slot />
          </div>
          <!-- <CookieConsent /> -->
        </n-scrollbar>
      </n-layout>
    </n-layout>

    <!-- Sidebar on mobile -->
    <Sidebar v-if="!isLg" :show-on-mobile="showMobileSidebar" @toggle-sidebar="toggleSidebar" />
  </div>
</template>

<script lang="ts" setup>
/** Global messages */
const message = useMessage();
window.$message = message;

const authStore = useAuthStore();
const { isLg, isXl } = useScreen();
const mainContentRef = ref<HTMLDivElement>();
const showMobileSidebar = ref<boolean>(false);
const sidebarCollapsed = ref<boolean>(false);

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

/** Hide sidebar if user flip device in mobile view */
watch(
  () => isLg.value,
  isLg => {
    toggleSidebar(isLg);
  }
);

watch(
  () => isXl.value,
  isXl => {
    toggleCollapse(!isXl);
  }
);

function toggleSidebar(show?: boolean) {
  if (show === undefined) {
    showMobileSidebar.value = !showMobileSidebar.value;
  } else {
    showMobileSidebar.value = show;
  }
}

function toggleCollapse(show?: boolean) {
  if (show === undefined) {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  } else {
    sidebarCollapsed.value = show;
  }
}

function onCollapse(collapsed: boolean) {
  sidebarCollapsed.value = collapsed;
}
</script>
