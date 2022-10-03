<template>
  <div class="relative h-screen pl-64 bg-grey-lightest">
    <Sidebar />
    <Header />
    <!-- <div :class="$style.content" class="h-screen">
    </div> -->
    <n-scrollbar style="max-height: calc(100vh - 80px)">
      <HeaderTabs />
      <n-message-provider :to="messageRef" :keep-alive-on-hover="true" :duration="3000">
        <div ref="messageRef" class="relative py-10 pl-20 pr-12">
          <slot />
        </div>
      </n-message-provider>
      <!-- <CookieConsent /> -->
    </n-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { NMessageProvider, NScrollbar } from 'naive-ui';
import { disableBodyScroll } from 'body-scroll-lock';

disableBodyScroll(document);

const messageRef = ref(null);
</script>

<style lang="postcss" module>
.content {
  @apply scrollbar;
  max-height: calc(100vh - 80px);
}
</style>
