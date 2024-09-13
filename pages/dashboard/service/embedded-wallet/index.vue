<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.nav.embeddedWallet') }}</h1>
        </slot>
      </Heading>
    </template>

    <slot>
      <div class="pb-8">
        <n-collapse
          v-if="settingsStore.hasEmbeddedWallets"
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
            <EmbeddedWalletInstructions />
          </n-collapse-item>
        </n-collapse>
        <EmbeddedWalletInstructions v-else />

        <ActionsEmbeddedWallet v-if="settingsStore.hasEmbeddedWallets" class="my-8" />
        <TableEmbeddedWallet v-if="settingsStore.hasEmbeddedWallets" />
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
  await sleep(10);
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    /** Fetch all api keys if they are not stored in settings store */
    await settingsStore.getEmbeddedWallets();

    pageLoading.value = false;
  });
});

function onUpdateAccordion(expandedNames: Array<string | number>) {
  instructionsVisible.value = expandedNames.length > 0;
}
</script>
