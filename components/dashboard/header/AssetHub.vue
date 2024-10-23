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
      <div v-if="switcher">
        <div class="text-center mb-1">
          <h5>{{ $t('general.environment') }} (testnet/mainnet)</h5>
        </div>
        <div class="flex gap-1 items-center">
          <span class="text-pink text-sm">{{ assetHubNetworks.westend.name }}</span>
          <n-switch v-model:value="isMainnet" :disabled="switchDisabled" @click="onSwitch" />
          <span class="text-violet text-sm">{{ assetHubNetworks.assetHub.name }}</span>
        </div>
      </div>

      <div
        v-if="assetHubStore.accountConnected"
        class="bg-bg-lighter rounded-xl text-sm px-3 flex gap-2 items-center h-10"
      >
        <p class="text-bodyDark">{{ truncateWallet(`${assetHubStore.account?.address}`) }}</p>
        <hr class="bg-bg h-full w-[1px] border-bg" />
        <p class="cursor-pointer text-white" @click="assetHubStore.account = null">
          {{ $t('general.disconnect') }}
        </p>
      </div>
      <div v-else-if="!switcher">
        <Btn
          type="primary"
          size="small"
          :loading="loadingWallet"
          @click="modalWalletSelectVisible = true"
        >
          {{ $t('dashboard.service.assetHub.connectWallet') }}
        </Btn>
      </div>
      <div v-else></div>
    </template>
  </Heading>

  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('auth.wallet.connect.title')">
    <AuthWalletDot
      :action-text="$t('auth.wallet.connect.btn')"
      :loading="loadingWallet"
      @sign="walletConnect"
    />
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
