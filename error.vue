<template>
  <div v-if="authStore.loggedIn" ref="mainContentRef" class="relative h-screen lg:pl-80">
    <n-config-provider :theme-overrides="themeOverrides">
      <n-message-provider
        :to="messageRef"
        placement="bottom-right"
        :keep-alive-on-hover="true"
        :duration="3000"
        closable
      >
        <Sidebar :show-on-mobile="showMobileSidebar" @toggle-sidebar="toggleSidebar" />
        <Header @toggleSidebar="toggleSidebar" />
        <n-scrollbar y-scrollable style="max-height: calc(100vh - 88px)">
          <div
            ref="messageRef"
            class="flex justify-center items-center relative pt-8 px-4 sm:px-8"
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
      </n-message-provider>
    </n-config-provider>
  </div>
  <div v-else class="relative min-h-screen h-full pb-28 md:pb-20">
    <n-config-provider :theme-overrides="themeOverrides">
      <AuthHeader />

      <div class="container flex justify-center items-center min-h-[70vh]">
        <div>
          <!-- customise 404 message from template section -->
          <n-h4>{{ $t('error.404') }}</n-h4>

          <!-- Redirect to home page -->
          <Btn type="secondary" @click="handleError">
            {{ $t('general.goHome') }}
          </Btn>
        </div>
      </div>

      <AuthFooter class="absolute left-0 right-0 bottom-0 w-full" />
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

// clear error and redirect to home page
const handleError = () => clearError({ redirect: authStore.loggedIn ? '/dashboard' : '/login' });
</script>
