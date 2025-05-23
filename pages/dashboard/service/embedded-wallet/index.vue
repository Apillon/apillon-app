<template>
  <Dashboard :empty="!dataStore.project.selected || !embeddedWalletStore.hasEmbeddedWallets" :loading="pageLoading">
    <template #empty>
      <ServiceEmpty
        :name="toCamelCase(Feature.EMBEDDED_WALLET)"
        :service="ServiceTypeName.EMBEDDED_WALLET"
        docs="https://wiki.apillon.io/web3-services/7-web3-compute.html"
      >
        <template #actions>
          <Btn
            inner-class="flex items-center justify-center "
            size="large"
            @click="modalNewEmbeddedWalletVisible = true"
          >
            <span>{{ $t('embeddedWallet.createNew') }}</span>
          </Btn>
        </template>
        <!-- Modal - Create new EW -->
        <modal v-model:show="modalNewEmbeddedWalletVisible" :title="$t('embeddedWallet.createNew')">
          <FormEmbeddedWallet @submit-success="modalNewEmbeddedWalletVisible = false" />
        </modal>
      </ServiceEmpty>
    </template>
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

    <n-space class="pb-8" :size="32" vertical>
      <ActionsEmbeddedWallet />
      <TableEmbeddedWallet />
    </n-space>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const pageLoading = ref<boolean>(true);
const modalNewEmbeddedWalletVisible = ref<boolean>(false);

useHead({
  title: t('embeddedWallet.title'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await embeddedWalletStore.getEmbeddedWallets();

  pageLoading.value = false;
});
</script>
