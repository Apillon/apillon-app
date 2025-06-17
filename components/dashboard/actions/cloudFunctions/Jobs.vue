<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="cloudFunctionStore.searchJobs" />
    </div>

    <n-space size="large">
      <!-- View template -->
      <n-button size="medium" tag="a" href="https://github.com/Apillon/cloud-function-template" target="_blank">
        <span class="icon-cloud-functions mr-2 text-xl"></span>
        {{ $t('computing.cloudFunctions.job.viewTemplate') }}
      </n-button>
      <BtnDocumentation
        size="medium"
        href="https://wiki.apillon.io/web3-services/8-web3-cloud-functions.html"
        hover-lighter
      />
      <!-- Refresh cloudFunctions -->
      <n-button size="medium" :loading="cloudFunctionStore.loading" @click="refresh">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new cloudFunction -->
      <n-button size="medium" :disabled="authStore.isAdmin()" @click="modalCreateJobVisible = true">
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('computing.cloudFunctions.job.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create CloudFunction Job -->
  <modal v-model:show="modalCreateJobVisible" :title="$t('computing.cloudFunctions.job.new')">
    <FormCloudFunctionsJob
      :function-uuid="cloudFunctionStore.functionUuid"
      @submit-success="modalCreateJobVisible = false"
      @create-success="onJobCreated"
    />
  </modal>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const paymentStore = usePaymentStore();
const cloudFunctionStore = useCloudFunctionStore();
const { modalCreateJobVisible, onJobCreated } = useCloudFunctions();

onMounted(() => {
  paymentStore.getPriceList();
});

async function refresh() {
  cloudFunctionStore.active = await cloudFunctionStore.fetchCloudFunction(cloudFunctionStore.functionUuid);
}
</script>
