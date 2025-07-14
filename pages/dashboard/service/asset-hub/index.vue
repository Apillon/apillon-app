<template>
  <Dashboard
    :empty="!dataStore.project.selected || !assetHubStore.hasAssets"
    :loading="pageLoading"
    :mainnet="assetHubStore.mainnet"
    full-height
  >
    <template #empty>
      <ServiceEmpty
        docs="https://wiki.apillon.io/web3-services/11-asset-hub.html"
        :name="toCamelCase(ServiceTypeName.ASSET_HUB)"
        :service="ServiceTypeName.ASSET_HUB"
        :guides="serviceGuides"
        :image="BannerWEBP"
        powered-by="polkadot"
      >
        <template #actions>
          <Btn
            v-if="!assetHubStore.account"
            size="large"
            type="primary"
            :loading="loadingWallet"
            @click="modalWalletSelectVisible = true"
          >
            {{ $t('assetHub.connectWallet') }}
          </Btn>
          <Btn v-else size="large" type="primary" :to="{ name: 'dashboard-service-asset-hub-new' }">
            {{ $t('assetHub.createNew') }}
          </Btn>
        </template>
      </ServiceEmpty>
    </template>
    <template #heading>
      <HeaderAssetHub :title="$t('dashboard.nav.assetHub')" switcher />
    </template>
    <slot>
      <div v-if="!assetHubStore.account" class="h-full">
        <div class="flex max-w-3xl items-center gap-4 border-1 border-primary px-5 py-2 lg:gap-10 xl:gap-20">
          <div class="mb-2 flex items-center">
            <span class="icon-info"></span>
            <p class="ml-2">{{ $t('assetHub.connect') }}</p>
          </div>

          <Btn type="primary" :loading="loadingWallet" @click="modalWalletSelectVisible = true">
            {{ $t('assetHub.connectWallet') }}
          </Btn>
        </div>
      </div>

      <div v-else-if="assetHubStore.loading && !assetHubStore.assetsLoaded" class="relative h-full min-h-[50dvh]">
        <Spinner class="absolute top-1/2" />
      </div>

      <n-space v-else class="pb-8" :size="32" vertical>
        <ActionsAssetHub />

        <TableAssetHub owned />

        <h4 class="my-4">{{ $t('assetHub.otherAssets') }}</h4>
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
import BannerWEBP from '/assets/images/service/assetHub.webp';

const { t } = useI18n();
const dataStore = useDataStore();
const assetHubStore = useAssetHubStore();
const { loadingWallet, modalWalletSelectVisible, pageLoading, initAssetHub, reconnectWallet, walletConnect } =
  useAssetHub();

const serviceGuides = [
  {
    title: 'Asset Hub and Apillon: Effortless asset creation in the Polkadot ecosystem',
    content:
      'Learn how Asset Hub simplifies asset creation in the Polkadot ecosystem and how Apillon makes it even easier with a no-code UI.',
    link: 'https://blog.apillon.io/asset-hub-and-apillon-effortless-asset-creation-in-the-polkadot-ecosystem-51ef5e51a32e/',
  },
];

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
