<template>
  <Dashboard :loading="pageLoading" :mainnet="assetHubStore.mainnet" full-height>
    <template #heading>
      <HeaderAssetHub :title="$t('dashboard.nav.assetHub')" switcher />
    </template>
    <slot>
      <div v-if="!assetHubStore.account" class="h-full">
        <div class="flex max-w-3xl items-center gap-4 border-1 border-primary px-5 py-2 lg:gap-10 xl:gap-20">
          <div class="mb-2 flex items-center">
            <span class="icon-info"></span>
            <p class="ml-2">{{ $t('dashboard.service.assetHub.connect') }}</p>
          </div>

          <Btn type="primary" :loading="loadingWallet" @click="modalWalletSelectVisible = true">
            {{ $t('dashboard.service.assetHub.connectWallet') }}
          </Btn>
        </div>
      </div>

      <div v-else-if="assetHubStore.loading && !assetHubStore.assetsLoaded" class="relative h-full min-h-[50dvh]">
        <Spinner class="absolute top-1/2" />
      </div>

      <n-space v-else class="pb-8" :size="32" vertical>
        <ActionsAssetHub />

        <TableAssetHub v-if="assetHubStore.hasAssets" owned />
        <Empty v-else :title="$t('dashboard.service.assetHub.noProject')" icon="storage/empty" small>
          <Btn type="primary" :to="{ name: 'dashboard-service-asset-hub-new' }">
            {{ $t('dashboard.service.assetHub.createNew') }}
          </Btn>
        </Empty>

        <h4 class="my-4">{{ $t('dashboard.service.assetHub.otherAssets') }}</h4>
        <TableAssetHub />
      </n-space>
    </slot>
  </Dashboard>

  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('auth.wallet.connect.title')">
    <AuthWalletDot
      :action-text="$t('auth.wallet.connect.btn')"
      :loading="loadingWallet"
      :disconnect="false"
      @sign="walletConnect"
    />
  </modal>
</template>
<script lang="ts" setup>
const { t } = useI18n();
const assetHubStore = useAssetHubStore();
const { loadingWallet, modalWalletSelectVisible, pageLoading, initAssetHub, reconnectWallet, walletConnect } =
  useAssetHub();

useHead({
  title: t('dashboard.nav.assetHub'),
});

onMounted(async () => {
  await initAssetHub();
  await reconnectWallet();
});

watch(
  () => assetHubStore.account,
  () => {
    if (assetHubStore.account) {
      assetHubStore.getAssets();
    }
  }
);
watch(
  () => assetHubStore.mainnet,
  () => {
    assetHubStore.getAssets();
  }
);
</script>

<style lang="postcss" module>
.icon {
  @apply mr-2 align-middle text-xl;
}
</style>
