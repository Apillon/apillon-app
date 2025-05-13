<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1 class="inline-block">
            {{ $t('dashboard.nav.embeddedWallet') }}
            <img src="/icons/beta.svg" alt="Beta" class="ml-2 inline-block h-5 w-14" />
          </h1>
        </slot>
        <template #info>
          <ModalCreditCosts :service="ServiceTypeName.EMBEDDED_WALLET" />
        </template>
      </Heading>
    </template>

    <slot>
      <div class="pb-8">
        <n-space v-if="embeddedWalletStore.hasEmbeddedWallets" :size="32" vertical>
          <n-collapse
            class="-mt-4 border-b-1 border-bg-lighter pb-4"
            accordion
            @update:expanded-names="onUpdateAccordion"
          >
            <n-collapse-item>
              <template #header>
                <span class="icon-info mr-2 text-xl"></span>
                {{ instructionsVisible ? $t('general.instructions.hide') : $t('general.instructions.show') }}
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
import { ServiceTypeName } from '~/lib/types/service';

const { t } = useI18n();
const dataStore = useDataStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const pageLoading = ref<boolean>(true);
const instructionsVisible = ref<boolean>(false);

useHead({
  title: t('embeddedWallet.title'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await embeddedWalletStore.getEmbeddedWallets();

  pageLoading.value = false;
});

function onUpdateAccordion(expandedNames: Array<string | number>) {
  instructionsVisible.value = expandedNames.length > 0;
}
</script>
