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
            style="max-height: 100dvh"
          >
            <Sidebar :show-on-mobile="showMobileSidebar" @toggle-sidebar="toggleSidebar" />
          </n-layout-sider>
          <n-layout>
            <Header @toggle-sidebar="toggleSidebar" />
            <div ref="messageRef" class="relative flex items-center justify-center px-4 pt-8 lg:min-h-[80dvh]">
              <div>
                <!-- customise 404 message from template section -->
                <n-h4>{{ $t('error.404') }}</n-h4>

                <!-- Redirect to home page -->
                <Btn type="secondary" @click="handleError">
                  {{ $t('general.goHome') }}
                </Btn>
              </div>
            </div>
          </n-layout>
        </n-layout>
      </n-message-provider>
    </n-config-provider>
  </div>
  <div v-else class="relative flex h-full min-h-screen flex-col justify-center bg-bg-dark align-middle">
    <n-config-provider :theme-overrides="themeOverrides">
      <div class="card container relative max-w-lg py-16 sm:px-8 md:px-12 lg:px-16">
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
import { themeOverrides } from '~/lib/config/naive-ui';

const { isLg } = useScreen();
const router = useRouter();
const authStore = useAuthStore();
const messageRef = ref<HTMLDivElement>();
const mainContentRef = ref<HTMLDivElement>();
const showMobileSidebar = ref<boolean>(false);

/**
 * Show/hide sidebar on mobile
 */
const { lengthX, lengthY } = useSwipe(mainContentRef, {
  onSwipeEnd() {
    if (!isLg.value && Math.abs(lengthX.value) > 150 && Math.abs(lengthX.value) > Math.abs(lengthY.value)) {
      /** Show sidebar if user swipe right otherwise close it   */
      toggleSidebar(lengthX.value < 0);
    }
  },
});

onMounted(() => {
  if (!authStore.loggedIn) {
    router.push({ name: 'login' });
  }
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
