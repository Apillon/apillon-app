<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderAssetHub :title="$t('dashboard.nav.assetHub')" />
    </template>
    <slot>
      <div
        v-if="!assetHubStore.account"
        class="flex gap-4 items-center py-2 px-5 border-1 border-primary max-w-3xl lg:gap-10 xl:gap-20"
      >
        <div class="flex items-center mb-2">
          <span class="icon-info"></span>
          <p class="ml-2">{{ $t('dashboard.service.assetHub.connect') }}</p>
        </div>

        <Btn type="primary" :loading="loadingWallet" @click="modalWalletSelectVisible = true">
          {{ $t('dashboard.service.assetHub.connectWallet') }}
        </Btn>
      </div>

      <n-space v-else-if="assetHubStore.hasAssets" class="pb-8" :size="32" vertical>
        <ActionsAssetHub />
        <TableAssetHub owned />
        <h4 class="mt-8 mb-4">{{ $t('dashboard.service.assetHub.otherAssets') }}</h4>
        <TableAssetHub />
      </n-space>

      <div
        v-else-if="assetHubStore.loading && !assetHubStore.assetsLoaded"
        class="relative h-full min-h-[50dvh]"
      >
        <Spinner class="absolute top-1/2" />
      </div>

      <template v-else>
        <Empty :title="$t('dashboard.service.assetHub.noProject')" icon="storage/empty">
          <Btn type="primary" :to="{ name: 'dashboard-service-asset-hub-new' }">
            {{ $t('dashboard.service.assetHub.createNew') }}
          </Btn>
        </Empty>
      </template>
    </slot>
  </Dashboard>

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
const { t } = useI18n();
const assetHubStore = useAssetHubStore();
const {
  loadingWallet,
  modalWalletSelectVisible,
  pageLoading,
  initAssetHub,
  reconnectWallet,
  walletConnect,
} = useAssetHub();

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
</script>

<style lang="postcss" module>
.icon {
  @apply mr-2 align-middle text-xl;
}
</style>
