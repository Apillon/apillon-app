<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1 class="inline-block">
            {{ $t('dashboard.nav.embeddedWallet') }}
            <img src="/icons/beta.svg" alt="Beta" class="w-14 h-5 inline-block ml-2" />
          </h1>
        </slot>
        <template #info>
          <ModalCreditCosts :service="ServiceTypeName.WALLET" />
        </template>
      </Heading>
    </template>

    <slot>
      <div class="pb-8">
        <n-collapse
          v-if="embeddedWalletStore.hasEmbeddedWallets"
          class="border-b-1 border-bg-lighter -mt-4 pb-4"
          accordion
          @update:expanded-names="onUpdateAccordion"
        >
          <n-collapse-item
            :title="
              instructionsVisible
                ? $t('embeddedWallet.hideInstructions')
                : $t('embeddedWallet.showInstructions')
            "
          >
            <template #header>
              <span class="icon-info text-xl mr-2"></span>
              {{
                instructionsVisible
                  ? $t('embeddedWallet.hideInstructions')
                  : $t('embeddedWallet.showInstructions')
              }}
            </template>
            <EmbeddedWalletInstructions />
          </n-collapse-item>
        </n-collapse>
        <EmbeddedWalletInstructions v-else class="border-b-1 border-bg-lighter pb-8" />

        <ActionsEmbeddedWallet v-if="embeddedWalletStore.hasEmbeddedWallets" class="my-8" />
        <TableEmbeddedWallet
          v-if="embeddedWalletStore.hasEmbeddedWallets"
          :embedded-wallets="embeddedWalletStore.items"
        />
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const pageLoading = ref<boolean>(true);
const instructionsVisible = ref<boolean>(false);

useHead({
  title: t('embeddedWallet.title'),
});

onMounted(async () => {
  await sleep(10);
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await embeddedWalletStore.getEmbeddedWallets();

    pageLoading.value = false;
  });
});

function onUpdateAccordion(expandedNames: Array<string | number>) {
  instructionsVisible.value = expandedNames.length > 0;
}
</script>
