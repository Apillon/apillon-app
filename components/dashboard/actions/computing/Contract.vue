<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] max-w-xs">
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
      <ModalCreditCosts :service="ServiceTypeName.COMPUTING" />

      <!-- Refresh contracts -->
      <n-button
        size="small"
        :loading="contractStore.loading"
        @click="contractStore.fetchContracts()"
      >
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new contract -->
      <n-button
        v-if="contractStore.hasContracts"
        size="small"
        :disabled="authStore.isAdmin()"
        @click="modalCreateContractVisible = true"
      >
        <span class="icon-create-folder text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('computing.contract.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create Contract -->
  <modal v-model:show="modalCreateContractVisible" :title="$t('computing.contract.new')">
    <FormComputingContract
      @submit-success="modalCreateContractVisible = false"
      @create-success="onContractCreated"
    />
  </modal>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const contractStore = useContractStore();
const paymentStore = usePaymentStore();
const { onContractCreated } = useComputing();

const modalCreateContractVisible = ref<boolean>(false);

onMounted(() => {
  paymentStore.getPriceList();
});
</script>
