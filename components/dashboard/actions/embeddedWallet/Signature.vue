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
        <span class="icon-edit mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('embeddedWallet.editIntegration') }}</span>
      </n-button>

      <!-- View documentation -->
      <BtnDocumentation
        size="small"
        href="https://wiki.apillon.io/build/12-embedded-wallets-integration.html"
        hover-lighter
      />

      <ModalCreditCosts :service="ServiceTypeName.EMBEDDED_WALLET" />
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/lib/types/service';

const embeddedWalletStore = useEmbeddedWalletStore();
const showModalEditEmbeddedWallet = ref<boolean | null>(false);
</script>
