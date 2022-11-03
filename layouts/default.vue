<template>
  <div class="relative h-screen pl-64">
    <n-message-provider :to="messageRef" :keep-alive-on-hover="true" :duration="5000">
      <Sidebar />
      <Header />
      <n-scrollbar class="bg-grey-dark" style="max-height: calc(100vh - 64px)">
        <HeaderTabs v-if="routeName === 'index'" />
        <div ref="messageRef" class="relative py-7 pl-8 pr-10">
          <slot />
        </div>
        <!-- <CookieConsent /> -->
      </n-scrollbar>
    </n-message-provider>
  </div>
</template>

<script lang="ts" setup>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

const messageRef = ref(null);

const route = useRoute();
const routeName = computed(() => {
  return route.name;
});

/**
 * Enable/disable body scroll
 */
onMounted(() => {
  disableBodyScroll(document);
});

onUnmounted(() => {
  clearAllBodyScrollLocks(document);
});
</script>
