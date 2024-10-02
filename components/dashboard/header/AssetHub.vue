<template>
  <Heading>
    <slot>
      <n-space align="center" size="large" :wrap="false">
        <NuxtLink v-if="backLink" :to="backLink">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <div>
          <h2 v-if="title">{{ title }}</h2>
          <h2 v-else>{{ $t('dashboard.service.assetHub.createAsset') }}</h2>
        </div>
      </n-space>
    </slot>

    <template #info>
      <n-space :size="32" align="center" :wrap="false">
        <ModalCreditCosts :service="ServiceTypeName.WALLET" />

        <div
          v-if="isConnected"
          class="bg-bg-lighter rounded-xl text-sm px-3 flex gap-2 items-center h-10"
        >
          <p class="text-bodyDark">{{ truncateWallet(`${address}`) }}</p>
          <hr class="bg-bg h-full w-[1px] border-bg" />
          <p class="cursor-pointer text-white" @click="disconnectWallet">
            {{ $t('general.disconnect') }}
          </p>
        </div>
      </n-space>
    </template>
  </Heading>
</template>

<script lang="ts" setup>
import { useAccount } from 'use-wagmi';

defineProps({
  backLink: { type: String, default: null },
  title: { type: String, default: null },
});

const { address, isConnected } = useAccount();
const { disconnectWallet } = useAssetHub();
</script>
