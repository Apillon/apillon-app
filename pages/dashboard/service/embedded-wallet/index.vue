<template>
  <Dashboard :empty="!dataStore.project.selected || !embeddedWalletStore.hasEmbeddedWallets" :loading="pageLoading">
    <template #empty>
      <ServiceEmpty
        :name="toCamelCase(Feature.EMBEDDED_WALLET)"
        :service="ServiceTypeName.EMBEDDED_WALLET"
        :guides="serviceGuides"
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

const serviceGuides = [
  {
    title: 'Embedded Wallets: Web2 experience, Web3 security',
    content:
      'The road to Web3 is still paved with many roadblocks, starting with complex digital wallets. For some, they are confusing and frustrating.',
    link: 'https://blog.apillon.io/embedded-wallets-web2-experience-web3-security-4074a69f64d5',
  },
  {
    title: 'Embedded Wallets FAQs: All you need to know about secure and seamless Web3',
    content: 'Learn how they make dapps easy, and stress-free, and why you don’t need any blockchain know-how.',
    link: 'https://blog.apillon.io/embedded-wallets-faqs-all-you-need-to-know-about-secure-and-seamless-web3-c39d56b6e5f1',
  },
  {
    title: 'Embedded Wallets 2.0: All the power, none of the pain',
    content:
      'Making Web3 simple wasn’t easy enough — we made it even easier to access and benefit from our version of account abstraction.',
    link: 'https://blog.apillon.io/embedded-wallets-2-0-all-the-power-none-of-the-pain-88679cdd2d68',
  },
];

useHead({
  title: t('embeddedWallet.title'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await embeddedWalletStore.getEmbeddedWallets();

  pageLoading.value = false;
});
</script>
