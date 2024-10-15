<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="">
      <!-- Modal - Create wallet -->
      <modal v-model:show="showModalEditEmbeddedWallet" :title="$t('embeddedWallet.edit')">
        <FormEmbeddedWallet
          :integration-uuid="embeddedWalletStore.active.integration_uuid"
          @submit-success="showModalEditEmbeddedWallet = false"
        />
      </modal>
    </div>

    <n-space size="large">
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

      <!-- View documentation -->
      <n-button
        size="small"
        href="https://wiki.apillon.io/build/12-embedded-wallets-integration.html"
      >
        <span class="icon-file text-xl mr-2"></span>
        {{ $t('embeddedWallet.viewDocumentation') }}
      </n-button>

      <n-button size="small" @click="showModalEditEmbeddedWallet = true">
        <span class="icon-wallet text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('embeddedWallet.editIntegration') }}</span>
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const embeddedWalletStore = useEmbeddedWalletStore();
const showModalEditEmbeddedWallet = ref<boolean | null>(false);
</script>
