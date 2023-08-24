<template>
  <div v-if="authStore.loggedIn" ref="mainContentRef" class="relative h-screen bg-bg">
    <n-config-provider :theme-overrides="themeOverrides">
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
            :show-trigger="false"
            collapse-mode="width"
            :width="320"
            :native-scrollbar="false"
            style="max-height: 100vh"
          >
            <Sidebar :show-on-mobile="showMobileSidebar" @toggle-sidebar="toggleSidebar" />
          </n-layout-sider>
          <n-layout>
            <Header @toggleSidebar="toggleSidebar" />
            <n-scrollbar y-scrollable style="max-height: calc(100vh - 88px)">
              <div
                ref="messageRef"
                class="flex justify-center items-center relative pt-8 px-4"
                style="height: calc(100vh - 88px)"
              >
                <div>
                  <!-- customise 404 message from template section -->
                  <n-h4>{{ $t('error.404') }}</n-h4>

                  <!-- Redirect to home page -->
                  <Btn type="secondary" @click="handleError">
                    {{ $t('general.goHome') }}
                  </Btn>
                </div>
              </div>
              <!-- <CookieConsent /> -->
            </n-scrollbar>
          </n-layout>
        </n-layout>
      </n-message-provider>
    </n-config-provider>
  </div>
  <div
    v-else
    class="relative flex flex-col justify-center align-middle min-h-screen h-full bg-bg-dark"
  >
    <n-config-provider :theme-overrides="themeOverrides">
      <div class="container relative max-w-lg py-16 sm:px-8 md:px-12 lg:px-16 card">
        <AuthHeader />
        <div>
          <!-- customize 404 message from template section -->
          <n-h4>{{ $t('error.404') }}</n-h4>

          <!-- Redirect to home page -->
          <Btn type="secondary" @click="handleError">
            {{ $t('general.goHome') }}
          </Btn>
        </div>
        <AuthFooter />
      </div>
    </n-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

const authStore = useAuthStore();
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

/** Hide sidebar if user flip device in mobile view */
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

// clear error and redirect to home page
const handleError = () => clearError({ redirect: authStore.loggedIn ? '/dashboard' : '/login' });
</script>
