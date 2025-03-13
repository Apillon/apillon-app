<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="cloudFunctionStore.search" />
    </div>

    <n-space size="large">
      <!-- Refresh cloudFunctions -->
      <n-button
        size="small"
        :loading="cloudFunctionStore.loading"
        @click="cloudFunctionStore.fetchCloudFunctions(archive)"
      >
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new cloudFunction -->
      <n-button
        v-if="cloudFunctionStore.hasCloudFunctions && !archive"
        size="small"
        :disabled="authStore.isAdmin()"
        @click="modalCreateCloudFunctionVisible = true"
      >
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('computing.cloudFunctions.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create CloudFunction -->
  <modal v-model:show="modalCreateCloudFunctionVisible" :title="$t('computing.cloudFunctions.new')">
    <FormComputingCloudFunctions
      @submit-success="modalCreateCloudFunctionVisible = false"
      @create-success="data => $router.push(`/dashboard/service/cloud-functions/${data.function_uuid}`)"
    />
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
