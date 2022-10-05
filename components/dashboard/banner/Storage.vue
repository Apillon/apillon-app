<template>
  <div class="relative bg-pink-purple text-white px-12 pt-5 pb-10 overflow-hidden rounded">
    <div class="max-w-[600px] w-1/2">
      <n-space size="large" align="center" class="h-12">
        <h4 class="mr-">{{ $t('nav.storage') }}</h4>
        <div class="w-[1px] h-[13px] bg-grey-light"></div>
        <div class="flex items-center h-12">
          <NuxtIcon name="StorageCrust" class="text-[80px]" fill />
        </div>
      </n-space>
      <p class="mb-7">
        Store your Web3 dapp data in a decentralized, private, and Metaverse-ready storage with
        instant access.
      </p>
      <n-button>
        Our team is working hard to get Storage live. Below learn more what to expect.
      </n-button>
    </div>
    <div class="absolute top-1/2 right-[75px] -translate-y-1/2">
      <Image src="./images/storage/sdk.svg" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NButton, NSpace } from 'naive-ui';
</script>
