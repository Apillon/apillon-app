<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <!-- Search transactions
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
      </n-input>    -->
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

      <!-- Open Bucket -->
      <n-button
        v-if="contractStore.active.bucket_uuid"
        size="small"
        :loading="loadingBucket"
        @click="openBucket(contractStore.active.bucket_uuid)"
      >
        <span class="icon-storage text-xl mr-2"></span>
        <span>{{ $t('nft.openBucket') }}</span>
      </n-button>

      <!-- Transfer contract -->
      <n-button size="small" :disabled="actionsDisabled" @click="emit('transfer')">
        {{ $t('computing.contract.transfer') }}
      </n-button>

      <ModalCreditCosts :service="ServiceTypeName.COMPUTING" />

      <!-- Refresh contracts -->
      <n-button
        size="small"
        :loading="transactionStore.loading"
        @click="
          transactionStore.fetchTransactions(contractStore.active.contract_uuid, {
            page: transactionStore.pagination.page,
          })
        "
      >
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>
    </n-space>
  </n-space>

  <Transition name="scaleY">
    <ComputingContractTabs v-if="uploadActive" />
  </Transition>
</template>

<script lang="ts" setup>
import colors from '~/tailwind.colors';

const props = defineProps({
  showUpload: { type: Boolean, default: false },
});
const emit = defineEmits(['transfer']);

const authStore = useAuthStore();
const dataStore = useDataStore();
const contractStore = useContractStore();
const transactionStore = useComputingTransactionStore();
const paymentStore = usePaymentStore();
const { loadingBucket, openBucket } = useStorage();

const uploadActive = ref<boolean>(props.showUpload);

const actionsDisabled = computed<boolean>(
  () =>
    contractStore.active?.contractStatus !== ContractStatus.DEPLOYED ||
    dataStore.isProjectUser ||
    authStore.isAdmin()
);

onMounted(() => {
  paymentStore.getPriceList();
});
</script>
