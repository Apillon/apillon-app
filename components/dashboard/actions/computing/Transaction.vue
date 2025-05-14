<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <!-- Search transactions
      <FormFieldSearch v-model:value="transactionStore.search"/>    
      -->
    </div>

    <n-space size="large">
      <!-- Encrypt file -->
      <n-button
        size="medium"
        :color="uploadActive ? colors.primary : ''"
        :disabled="authStore.isAdmin()"
        @click="uploadActive = !uploadActive"
      >
        <span class="icon-file mr-2 text-xl"></span>
        {{ $t('computing.contract.encryptFile') }}
      </n-button>

      <!-- Open Bucket -->
      <n-button
        v-if="contractStore.active.bucket_uuid"
        size="medium"
        :loading="loadingBucket"
        @click="openBucket(contractStore.active.bucket_uuid)"
      >
        <span class="icon-storage mr-2 text-xl"></span>
        <span>{{ $t('nft.openBucket') }}</span>
      </n-button>

      <!-- Transfer contract -->
      <n-button size="medium" :disabled="actionsDisabled" @click="emit('transfer')">
        {{ $t('computing.contract.transfer') }}
      </n-button>

      <ModalCreditCosts :service="ServiceTypeName.COMPUTING" />

      <!-- Refresh contracts -->
      <n-button
        size="medium"
        :loading="transactionStore.loading"
        @click="
          transactionStore.fetchTransactions(contractStore.active.contract_uuid, {
            page: transactionStore.pagination.page,
          })
        "
      >
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>
    </n-space>
  </n-space>

  <Transition name="scaleY">
    <ComputingContractTabs v-if="uploadActive" />
  </Transition>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/lib/types/service';
import { colors } from '~/tailwind.config';

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
    contractStore.active?.contractStatus !== ContractStatus.DEPLOYED || dataStore.isProjectUser || authStore.isAdmin()
);

onMounted(() => {
  paymentStore.getPriceList();
});
</script>
