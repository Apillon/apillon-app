<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderEmbeddedWallet />
    </template>

    <slot>
      <div class="relative pb-8">
        <h2 class="mb-4">Start building</h2>

        <div class="absolute right-4 flex gap-4 mb-4">
          <!-- View documentation -->
          <n-button
            size="small"
            href="https://wiki.apillon.io/web3-services/8-embedded-wallets.html"
          >
            <span class="icon-file text-xl mr-2"></span>
            {{ $t('embeddedWallet.viewDocumentation') }}
          </n-button>

          <NuxtLink :to="{ name: 'dashboard-api-keys' }">
            <n-button size="small">
              <span class="icon-magic-link text-xl text-primary mr-2"></span>
              <span class="text-primary">{{ $t('embeddedWallet.goToApiKey') }}</span>
            </n-button>
          </NuxtLink>
        </div>

        <TableEmbeddedWalletSignatures />

        <CodeSnippet />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { params } = useRoute();
const router = useRouter();
const dataStore = useDataStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('embeddedWallet.title'),
});

onMounted(async () => {
  await sleep(10);

  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    const walletUuid = `${params?.id}` || '';
    const embeddedWallet = await embeddedWalletStore.getEmbeddedWallet(walletUuid);

    if (!embeddedWallet) {
      router.push({ name: 'dashboard-service-embedded-wallet' });
      return;
    }
    embeddedWalletStore.active = embeddedWallet;
  });
  pageLoading.value = false;
});
</script>
