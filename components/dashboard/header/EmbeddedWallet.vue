<template>
  <Heading
    :back="{ name: 'dashboard-service-embedded-wallet' }"
    docs="https://wiki.apillon.io/build/12-embedded-wallets-integration.html"
    :service="ServiceTypeName.EMBEDDED_WALLET"
  >
    <div>
      <h3>
        {{ $t('dashboard.nav.embeddedWallet') }}: {{ embeddedWalletStore.active.title }}
        <img src="/icons/beta.svg" alt="Beta" class="ml-2 inline-block h-5 w-14" />
      </h3>
      <TableEllipsis
        :prefix="$t('embeddedWallet.table.integration_uuid')"
        :text="embeddedWalletStore.active.integration_uuid"
      />
    </div>

    <template #links>
      <n-button size="medium" @click="showModalEditEmbeddedWallet = true">
        <span class="icon-edit mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('embeddedWallet.editIntegration') }}</span>
      </n-button>

      <!-- Modal - Create wallet -->
      <modal v-model:show="showModalEditEmbeddedWallet" :title="$t('embeddedWallet.edit')">
        <FormEmbeddedWallet
          :integration-uuid="embeddedWalletStore.active.integration_uuid"
          @submit-success="showModalEditEmbeddedWallet = false"
        />
      </modal>
    </template>
  </Heading>
</template>

<script lang="ts" setup>
const embeddedWalletStore = useEmbeddedWalletStore();
const showModalEditEmbeddedWallet = ref<boolean | null>(false);
</script>
