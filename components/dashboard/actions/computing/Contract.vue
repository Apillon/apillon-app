<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="contractStore.search" />
    </div>

    <n-space size="large">
      <!-- Refresh contracts -->
      <n-button size="medium" :loading="contractStore.loading" @click="contractStore.fetchContracts(archive)">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new contract -->
      <n-button
        v-if="contractStore.hasContracts"
        size="medium"
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
