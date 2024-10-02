<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderAssetHub />
    </template>
    <slot>
      <div
        v-if="!isConnected"
        class="flex gap-4 items-center py-2 px-5 border-1 border-primary max-w-3xl lg:gap-10 xl:gap-20"
      >
        <div class="flex items-center mb-2">
          <span class="icon-info"></span>
          <p class="ml-2">{{ $t('dashboard.service.assetHub.connect') }}</p>
        </div>

        <Btn type="primary" :loading="loading" @click="connectWallet">
          {{ $t('dashboard.service.assetHub.connectWallet') }}
        </Btn>
      </div>

      <n-space v-else-if="!assetHubStore.hasAssets" class="pb-8" :size="32" vertical>
        <ActionsAssetHub />
        <TableAssetHub />
      </n-space>

      <template v-else>
        <Empty :title="$t('dashboard.service.assetHub.noProject')" icon="storage/empty">
          <Btn type="primary" :to="{ name: 'dashboard-service-asset-hub-new' }">
            {{ $t('dashboard.service.assetHub.createNew') }}
          </Btn>
        </Empty>
      </template>
    </slot>
  </Dashboard>
</template>
<script lang="ts" setup>
import { useAccount } from 'use-wagmi';

const { t } = useI18n();
const dataStore = useDataStore();
const assetHubStore = useAssetHubStore();
const { loading, connectWallet } = useAssetHub();
const { isConnected } = useAccount();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('dashboard.nav.assetHub'),
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
