<template>
  <div v-if="!authStore.loadingProfile" ref="mainContentRef" class="relative h-screen">
    <n-layout class="h-full" :has-sider="isLg" sider-placement="right">
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
          @update-collapsed="onCollapseSidebar"
        >
          <Sidebar :collapsed="sidebarCollapsed" />
        </n-layout-sider>
        <n-layout>
          <Header @toggle-sidebar="toggleSidebar" @toggle-chat="toggleChat"> </Header>
          <n-scrollbar y-scrollable style="max-height: calc(100dvh - 88px)">
            <div class="relative pt-8 px-4 sm:px-8">
              <slot />
            </div>
            <!-- <CookieConsent /> -->
          </n-scrollbar>
        </n-layout>
      </n-layout>
      <n-layout-sider
        v-if="isLg"
        :show-trigger="true"
        :collapsed="grillChatCollapsed"
        :collapsed-width="64"
        collapse-mode="width"
        :width="isXxl ? 420 : 320"
        :native-scrollbar="false"
        bordered
        class="sider-visible"
        style="max-height: 100dvh"
        @update-collapsed="onCollapseChat"
      >
        <GrillChat :class="{ '-mr-2': grillChatCollapsed }" />
        <div
          v-if="grillChatCollapsed"
          class="absolute top-0 left-0 w-full h-screen cursor-pointer bg-bg-dark/25"
          @click="toggleCollapseChat()"
        ></div>
        <button class="n-layout-toggle-button !top-4" @click="modalChatSettingsVisible = true">
          <span class="icon-project-setting text-lg text-white"></span>
        </button>
      </n-layout-sider>
    </n-layout>

    <!-- Sidebar on mobile -->
    <Sidebar v-if="!isLg" :show-on-mobile="showMobileSidebar" @toggle-sidebar="toggleSidebar" />
    <SidebarGrillChat v-if="!isLg" :show-on-mobile="showMobileChat" @toggle-chat="toggleChat" />

    <!-- Modal - Create Contract -->
    <modal v-model:show="modalChatSettingsVisible" :title="$t('dashboard.chat.settings')">
      <GrillChatSettings @close="modalChatSettingsVisible = false" />
    </modal>
  </div>
</template>

<script lang="ts" setup>
/** Global messages */
const message = useMessage();
window.$message = message;

const authStore = useAuthStore();
const { isLg, isXl, isXxl } = useScreen();
const mainContentRef = ref<HTMLDivElement>();
const showMobileSidebar = ref<boolean>(false);
const sidebarCollapsed = ref<boolean>(false);
const grillChatCollapsed = ref<boolean>(true);
const showMobileChat = ref<boolean>(false);
const modalChatSettingsVisible = ref<boolean>(false);

/**
 * Show/hide sidebar on mobile
 */
const { lengthX, lengthY } = useSwipe(mainContentRef, {
  onSwipeEnd() {
    if (
      !isLg.value &&
      Math.abs(lengthX.value) > 250 &&
      Math.abs(lengthX.value) > Math.abs(lengthY.value)
    ) {
      const isLeftToRight = lengthX.value < 0;

      /** Show/hide sidebar or chat if user swipe for more than 250px    */
      if ((showMobileSidebar.value && !isLeftToRight) || (!showMobileChat.value && isLeftToRight)) {
        toggleSidebar(isLeftToRight);
      } else {
        toggleChat(!isLeftToRight);
      }
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

function toggle(item: Ref<boolean>, show?: boolean) {
  if (show === undefined) {
    item.value = !item.value;
  } else {
    item.value = show;
  }
}

function toggleSidebar(show?: boolean) {
  toggle(showMobileSidebar, show);
}

function toggleCollapse(show?: boolean) {
  toggle(sidebarCollapsed, show);
}

function toggleChat(show?: boolean) {
  toggle(showMobileChat, show);
}

function toggleCollapseChat(show?: boolean) {
  toggle(grillChatCollapsed, show);
}

function onCollapseSidebar(collapsed: boolean) {
  sidebarCollapsed.value = collapsed;

  if (!isXxl.value) {
    grillChatCollapsed.value = true;
  }
}

function onCollapseChat(collapsed: boolean) {
  grillChatCollapsed.value = collapsed;

  if (!isXxl.value) {
    sidebarCollapsed.value = true;
  }
}
</script>
