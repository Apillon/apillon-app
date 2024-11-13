<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
        v-model:value="indexerStore.search"
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
      <n-button size="small" :loading="indexerStore.loading" @click="indexerStore.fetchIndexers()">
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new indexer -->
      <n-button size="small" :disabled="authStore.isAdmin()" @click="showModalNewIndexer = true">
        <span class="icon-file text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('indexer.new') }}</span>
      </n-button>
      <!-- Show Docs -->
      <Btn
        size="small"
        type="secondary"
        inner-class="text-white flex items-center justify-center"
        href="https://wiki.apillon.io/web3-services/10-web3-infrastructure.html#indexing-service"
      >
        <span class="icon-file text-xl mr-2"></span>
        <span>{{ $t('indexer.viewDocumentation') }}</span>
      </Btn>
    </n-space>
  </n-space>
  <!-- Modal - Create Indexer -->
  <IndexerSpendingWarning v-model:show="showModalNewIndexer">
    <FormIndexer />
  </IndexerSpendingWarning>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const indexerStore = useIndexerStore();

const showModalNewIndexer = ref<boolean | null>(false);
</script>
