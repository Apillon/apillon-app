<template>
  <Heading>
    <slot>
      <n-space align="center" size="large" :wrap="false">
        <NuxtLink v-if="backLink" :to="backLink">
          <span class="icon-back align-sub text-2xl"></span>
        </NuxtLink>
        <div class="flex items-center">
          <h2 v-if="title">{{ title }}</h2>
          <h2 v-else>{{ $t('assetHub.createAsset') }}</h2>
          <img src="/icons/beta.svg" alt="Beta" class="ml-2 inline-block h-5 w-14" />
        </div>
      </n-space>
    </slot>

    <template #info>
      <div v-if="switcher">
        <div class="mb-1 text-center">
          <h5>{{ $t('general.environment') }} (testnet/mainnet)</h5>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-sm text-pink">{{ assetHubNetworks.westend.name }}</span>
          <n-switch v-model:value="isMainnet" :disabled="switchDisabled" @click="onSwitch" />
          <span class="text-sm text-violet">{{ assetHubNetworks.assetHub.name }}</span>
        </div>
      </div>

      <div
        v-if="assetHubStore.accountConnected"
        class="flex h-10 items-center gap-2 rounded-xl bg-bg-lighter px-3 text-sm"
      >
        <p class="text-bodyDark">{{ truncateWallet(`${assetHubStore.account?.address}`) }}</p>
        <hr class="h-full w-[1px] border-bg bg-bg" />
        <p class="cursor-pointer text-white" @click="assetHubStore.account = null">
          {{ $t('general.disconnect') }}
        </p>
      </div>
      <div v-else-if="!switcher">
        <Btn type="primary" size="small" :loading="loadingWallet" @click="modalWalletSelectVisible = true">
          {{ $t('assetHub.connectWallet') }}
        </Btn>
      </div>
      <div v-else></div>
    </template>
  </Heading>

  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('auth.wallet.connect.title')">
    <AuthWalletDot :action-text="$t('auth.wallet.connect.btn')" :loading="loadingWallet" @sign="walletConnect" />
  </modal>
</template>

<script lang="ts" setup>
defineProps({
  backLink: { type: String, default: null },
  switcher: { type: Boolean, default: false },
  title: { type: String, default: null },
});

const assetHubStore = useAssetHubStore();
const { loadingWallet, modalWalletSelectVisible, walletConnect } = useAssetHub();

const isMainnet = ref<boolean>(assetHubStore.mainnet);
const switchDisabled = ref<boolean>(false);

const onSwitch = () => {
  switchDisabled.value = true;

  setTimeout(() => (assetHubStore.mainnet = isMainnet.value), 200);
  setTimeout(() => (switchDisabled.value = false), 2000);
};
</script>
