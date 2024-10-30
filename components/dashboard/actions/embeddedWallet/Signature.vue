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
      <n-button size="small" @click="showModalEditEmbeddedWallet = true">
        <span class="icon-edit text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('embeddedWallet.editIntegration') }}</span>
      </n-button>

      <!-- View documentation -->
      <Btn
        type="secondary"
        size="small"
        inner-class="text-white flex items-center justify-center"
        href="https://wiki.apillon.io/build/12-embedded-wallets-integration.html"
      >
        <span class="icon-file text-xl mr-2"></span>
        {{ $t('embeddedWallet.viewDocumentation') }}
      </Btn>

      <ModalCreditCosts :service="ServiceTypeName.WALLET" />
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const embeddedWalletStore = useEmbeddedWalletStore();
const showModalEditEmbeddedWallet = ref<boolean | null>(false);
</script>
