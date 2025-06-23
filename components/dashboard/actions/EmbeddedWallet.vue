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

      <Btn inner-class="flex gap-2 items-center" @click="showModalNewEmbeddedWallet = true">
        <span class="icon-add text-xl"></span>
        <span>{{ $t('embeddedWallet.createNew') }}</span>
      </Btn>
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
