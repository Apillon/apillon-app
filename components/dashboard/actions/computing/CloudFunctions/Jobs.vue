<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
        v-model:value="cloudFunctionStore.searchJobs"
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
      <!-- View template -->
      <n-button
        size="small"
        tag="a"
        href="https://github.com/Apillon/cloud-function-template"
        target="_blank"
      >
        <span class="icon-cloud-functions text-xl mr-2"></span>
        {{ $t('computing.cloudFunctions.job.viewTemplate') }}
      </n-button>
      <n-button
        size="small"
        tag="a"
        href="https://wiki.apillon.io/web3-services/8-web3-cloud-functions.html"
        target="_blank"
      >
        <span class="icon-file text-xl mr-2"></span>
        {{ $t('computing.cloudFunctions.documentation') }}
      </n-button>
      <!-- Refresh cloudFunctions -->
      <n-button size="small" :loading="cloudFunctionStore.loading" @click="refresh">
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new cloudFunction -->
      <n-button size="small" :disabled="authStore.isAdmin()" @click="modalCreateJobVisible = true">
        <span class="icon-create-folder text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('computing.cloudFunctions.job.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create CloudFunction Job -->
  <modal v-model:show="modalCreateJobVisible" :title="$t('computing.cloudFunctions.job.new')">
    <FormComputingCloudFunctionsJob
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
  cloudFunctionStore.active = await cloudFunctionStore.fetchCloudFunction(
    cloudFunctionStore.functionUuid
  );
}
</script>
