<template>
  <div class="relative h-screen pl-64 bg-grey-lightest">
    <n-message-provider :to="messageRef" :keep-alive-on-hover="true" :duration="5000">
      <Sidebar />
      <Header />
      <n-scrollbar style="max-height: calc(100vh - 80px)">
        <HeaderTabs />
        <div ref="messageRef" class="relative py-10 pl-20 pr-12">
          <slot />
        </div>
        <!-- <CookieConsent /> -->
      </n-scrollbar>
    </n-message-provider>
  </div>
</template>

<script lang="ts" setup>
import { NMessageProvider, NScrollbar } from 'naive-ui';
import { disableBodyScroll } from 'body-scroll-lock';

disableBodyScroll(document);

const messageRef = ref(null);
</script>
