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
const settingsStore = useSettingsStore();

const pageLoading = ref<boolean>(true);
const walletApiKey = ref<string>(`${params?.id}` || '');

useHead({
  title: t('embeddedWallet.title'),
});

onMounted(async () => {
  await sleep(10);
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await settingsStore.getEmbeddedWallets();
    settingsStore.selectedWallet = walletApiKey.value;

    if (!settingsStore.activeWallet) {
      router.push({ name: 'dashboard-service-computing' });
    }
  });
  pageLoading.value = false;
});
</script>
