<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="transactionStore.search"
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
      <!-- Encrypt file -->
      <n-button
        size="small"
        :color="uploadActive ? colors.primary : ''"
        :disabled="authStore.isAdmin()"
        @click="uploadActive = !uploadActive"
      >
        <span class="icon-file text-xl mr-2"></span>
        {{ $t('computing.contract.encryptFile') }}
      </n-button>

      <!-- Transfer contract -->
      <n-button size="small" :disabled="actionsDisabled" @click="emit('transfer')">
        {{ $t('computing.contract.transfer') }}
      </n-button>

      <!-- Refresh contracts -->
      <n-button
        size="small"
        :loading="transactionStore.loading"
        @click="
          transactionStore.fetchTransactions(
            contractStore.active.contract_uuid,
            transactionStore.pagination.page
          )
        "
      >
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>
    </n-space>
  </n-space>

  <ComputingContractTabs v-show="uploadActive" />
</template>

<script lang="ts" setup>
import colors from '~/tailwind.colors';

const emit = defineEmits(['transfer']);

const authStore = useAuthStore();
const dataStore = useDataStore();
const contractStore = useContractStore();
const transactionStore = useComputingTransactionStore();

const uploadActive = ref<boolean>(false);

const actionsDisabled = computed<boolean>(
  () =>
    contractStore.active?.contractStatus !== ContractStatus.DEPLOYED ||
    dataStore.isProjectUser ||
    authStore.isAdmin()
);
</script>
