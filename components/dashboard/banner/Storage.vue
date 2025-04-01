<template>
  <div class="relative overflow-hidden rounded bg-bg-dark px-12 pb-10 pt-5">
    <div class="w-2/3 max-w-[600px]">
      <n-space size="large" align="center" class="h-12">
        <h4 class="">{{ $t('dashboard.nav.storage') }}</h4>
        <div class="h-[13px] w-[1px] bg-white"></div>
        <div class="flex h-12 items-center">
          <NuxtIcon name="storage/crust" class="text-[80px]" filled />
        </div>
      </n-space>
      <p class="mb-7 text-sm">
        Store your Web3 dapp data in a decentralized, private, and Metaverse-ready storage with instant access.
      </p>
      <Notification type="error">
        Our team is working hard to get Storage live. Below learn more what to expect.
      </Notification>
    </div>
    <div class="absolute right-0 top-1/2 -translate-y-1/2">
      <AnimationIcons :num-of-icons="8" :animation-name="'labirynth'" :size="'md'" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>
