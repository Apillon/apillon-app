<template>
  <ServiceEmpty
    v-if="!dataStore.project.selected"
    :name="toCamelCase(Feature.EMBEDDED_WALLET)"
    :service="ServiceTypeName.EMBEDDED_WALLET"
    docs="https://wiki.apillon.io/web3-services/7-web3-compute.html"
  />
  <Dashboard v-else :loading="pageLoading">
    <template #heading>
      <Heading
        :headline="$t('dashboard.nav.embeddedWallet')"
        :service="ServiceTypeName.EMBEDDED_WALLET"
        demo="9y-9nz0tpVs"
        beta
      >
        <template #details>
          <EmbeddedWalletInstructions :show-video="false" />
        </template>
      </Heading>
    </template>

    <slot>
      <div class="pb-8">
        <n-space v-if="embeddedWalletStore.hasEmbeddedWallets" :size="32" vertical>
          <ActionsEmbeddedWallet />
          <TableEmbeddedWallet />
        </n-space>
        <EmbeddedWalletInstructions v-else />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('embeddedWallet.title'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await embeddedWalletStore.getEmbeddedWallets();

  pageLoading.value = false;
});
</script>
