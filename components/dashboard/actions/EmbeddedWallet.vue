<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="embeddedWalletStore.search" />
    </div>

    <n-space size="large">
      <!-- Refresh -->
      <n-button
        size="medium"
        :loading="embeddedWalletStore.loading"
        @click="embeddedWalletStore.fetchEmbeddedWallets()"
      >
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <n-button size="medium" @click="showModalNewEmbeddedWallet = true">
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('embeddedWallet.createNew') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create wallet -->
  <modal v-model:show="showModalNewEmbeddedWallet" :title="$t('embeddedWallet.createNew')">
    <FormEmbeddedWallet @submit-success="showModalNewEmbeddedWallet = false" />
  </modal>
</template>

<script lang="ts" setup>
const embeddedWalletStore = useEmbeddedWalletStore();
const showModalNewEmbeddedWallet = ref<boolean | null>(false);
</script>
