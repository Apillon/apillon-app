<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
        v-model:value="cloudFunctionStore.search"
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
      <ModalCreditCosts v-if="!archive" :service="ServiceTypeName.COMPUTING" />

      <!-- Refresh cloudFunctions -->
      <n-button
        size="small"
        :loading="cloudFunctionStore.loading"
        @click="cloudFunctionStore.fetchCloudFunctions(archive)"
      >
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new cloudFunction -->
      <n-button
        v-if="cloudFunctionStore.hasCloudFunctions && !archive"
        size="small"
        :disabled="authStore.isAdmin()"
        @click="modalCreateCloudFunctionVisible = true"
      >
        <span class="icon-create-folder text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('computing.cloudFunctions.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create CloudFunction -->
  <modal v-model:show="modalCreateCloudFunctionVisible" :title="$t('computing.cloudFunctions.new')">
    <FormComputingCloudFunctions @submit-success="modalCreateCloudFunctionVisible = false" />
  </modal>
</template>

<script lang="ts" setup>
defineProps({
  archive: { type: Boolean, default: false },
});

const authStore = useAuthStore();
const cloudFunctionStore = useCloudFunctionStore();
const paymentStore = usePaymentStore();

const modalCreateCloudFunctionVisible = ref<boolean>(false);

onMounted(() => {
  cloudFunctionStore.search = '';
  paymentStore.getPriceList();
});
</script>
