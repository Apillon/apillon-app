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
        <n-space v-if="embeddedWalletStore.hasEmbeddedWallets" :size="32" vertical>
          <n-collapse
            class="border-b-1 border-bg-lighter -mt-4 pb-4"
            accordion
            @update:expanded-names="onUpdateAccordion"
          >
            <n-collapse-item>
              <template #header>
                <span class="icon-info text-xl mr-2"></span>
                {{
                  instructionsVisible
                    ? $t('general.instructions.hide')
                    : $t('general.instructions.show')
                }}
              </template>
              <EmbeddedWalletInstructions />
            </n-collapse-item>
          </n-collapse>
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
