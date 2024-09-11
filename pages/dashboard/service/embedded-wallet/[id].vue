<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderEmbeddedWallet />
    </template>

    <slot>
      <div class="pb-8">
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
              <span class="text-primary">{{ $t('dashboard.pageMenu.apiKeys') }}</span>
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
const dataStore = useDataStore();
const settingsStore = useSettingsStore();

const pageLoading = ref<boolean>(true);
const instructionsVisible = ref<boolean>(false);

useHead({
  title: t('embeddedWallet.title'),
});

onMounted(async () => {
  await sleep(500);
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    /** Fetch all services if there is any service type unloaded */
    await dataStore.getServices();

    /** Fetch all api keys if they are not stored in settings store */
    await settingsStore.getEmbeddedWallets();

    pageLoading.value = false;
  });
});

function onUpdateAccordion(expandedNames: Array<string | number>) {
  console.log(expandedNames);
  instructionsVisible.value = expandedNames.length > 0;
}
</script>
