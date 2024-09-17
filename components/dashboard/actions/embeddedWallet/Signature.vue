<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
        v-model:value="embeddedWalletStore.signature.search"
        type="text"
        name="search"
        size="small"
        :placeholder="$t('general.search')"
        clearable
      >
        <template #prefix>
          <span class="icon-search text-2xl"></span>
        </template>
      </n-input>
    </div>

    <n-space size="large">
      <ModalCreditCosts :service="ServiceTypeName.WALLET" />

      <!-- Refresh -->
      <n-button
        size="small"
        :loading="embeddedWalletStore.loading"
        @click="
          embeddedWalletStore.fetchSignatures(
            embeddedWalletStore.integrationUuid,
            embeddedWalletStore.signature.pagination.page,
            embeddedWalletStore.signature.pagination.pageSize
          )
        "
      >
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const embeddedWalletStore = useEmbeddedWalletStore();
</script>
