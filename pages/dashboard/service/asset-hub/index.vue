<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.nav.assetHub') }}</h1>
        </slot>
      </Heading>
    </template>
    <slot>
      <div v-if="!isWalletConnected" class="py-2 px-5 border-1 border-[#F9FF73]">
        <div class="flex items-center mb-2">
          <span class="icon-info"></span>
          <p class="ml-2">{{ $t('dashboard.service.assetHub.connect') }}</p>
        </div>

        <n-button type="primary" native-type="submit" class="mb-1" @click="connectWallet">
          {{ $t('dashboard.service.assetHub.connectWallet') }}
        </n-button>
      </div>

      <template v-else>
        <!-- todo handle display of contractds from store -->
        <Empty :title="$t('dashboard.service.assetHub.noProject')" icon="storage/empty">
          <Btn type="primary" @click="router.push({ name: 'dashboard-service-asset-hub-new' })">
            {{ $t('computing.contract.createFirst') }}
          </Btn>
        </Empty>
      </template>
    </slot>
  </Dashboard>
</template>
<script lang="ts" setup>
const router = useRouter();
const $i18n = useI18n();
const dataStore = useDataStore();
const { isWalletConnected, connectWallet } = useAssetHub();

const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('dashboard.nav.assetHub'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      pageLoading.value = false;
    });
  }, 100);
});
</script>

<style lang="postcss" module>
.icon {
  @apply mr-2 align-middle text-xl;
}
</style>
