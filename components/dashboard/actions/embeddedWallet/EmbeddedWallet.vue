<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
        v-model:value="embeddedWalletStore.search"
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
      <!-- Refresh -->
      <n-button
        size="small"
        :loading="embeddedWalletStore.loading"
        @click="embeddedWalletStore.fetchEmbeddedWallets()"
      >
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <n-button size="small" @click="showModalNewEmbeddedWallet = true">
        <span class="icon-create-folder text-xl text-primary mr-2"></span>
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
