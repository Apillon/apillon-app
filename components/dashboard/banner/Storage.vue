<template>
  <div class="relative bg-bg-dark px-12 pt-5 pb-10 overflow-hidden rounded">
    <div class="max-w-[600px] w-2/3">
      <n-space size="large" align="center" class="h-12">
        <h4 class="">{{ $t('dashboard.nav.storage') }}</h4>
        <div class="w-[1px] h-[13px] bg-white"></div>
        <div class="flex items-center h-12">
          <NuxtIcon name="storage/crust" class="text-[80px]" filled />
        </div>
      </n-space>
      <p class="mb-7 text-sm">
        Store your Web3 dapp data in a decentralized, private, and Metaverse-ready storage with
        instant access.
      </p>
      <Notification type="error">
        Our team is working hard to get Storage live. Below learn more what to expect.
      </Notification>
    </div>
    <div class="absolute top-1/2 right-0 -translate-y-1/2">
      <AnimationIcons :num-of-icons="8" :animation-name="'labirynth'" :size="'md'" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>
