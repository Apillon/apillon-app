<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <n-input
        v-model:value="contractStore.search"
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
      <ModalCreditCosts :service="ServiceTypeName.SMART_CONTRACTS" />

      <!-- Refresh contracts -->
      <n-button size="small" :loading="contractStore.loading" @click="contractStore.fetchContracts(archive)">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new contract -->
      <n-button
        v-if="contractStore.hasContracts"
        size="small"
        :disabled="authStore.isAdmin()"
        @click="modalCreateContractVisible = true"
      >
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('computing.contract.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create Contract -->
  <modal v-model:show="modalCreateContractVisible" :title="$t('computing.contract.new')">
    <FormComputingContract @submit-success="modalCreateContractVisible = false" @create-success="onContractCreated" />
  </modal>
</template>

<script lang="ts" setup>
import { ServiceTypeName } from '~/lib/types/service';

defineProps({
  archive: { type: Boolean, default: false },
});
const authStore = useAuthStore();
const contractStore = useContractStore();
const paymentStore = usePaymentStore();
const { onContractCreated } = useComputing();

const modalCreateContractVisible = ref<boolean>(false);

onMounted(() => {
  paymentStore.getPriceList();
});
</script>
