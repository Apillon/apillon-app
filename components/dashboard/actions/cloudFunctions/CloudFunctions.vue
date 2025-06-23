<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="cloudFunctionStore.search" />
    </div>

    <n-space size="large">
      <!-- Refresh cloudFunctions -->
      <n-button
        size="medium"
        :loading="cloudFunctionStore.loading"
        @click="cloudFunctionStore.fetchCloudFunctions(archive)"
      >
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new cloudFunction -->
      <Btn
        v-if="cloudFunctionStore.hasCloudFunctions && !archive"
        inner-class="flex gap-2 items-center"
        :disabled="authStore.isAdmin()"
        @click="modalCreateCloudFunctionVisible = true"
      >
        <span class="icon-add text-xl"></span>
        <span>{{ $t('computing.cloudFunctions.new') }}</span>
      </Btn>
    </n-space>
  </n-space>

  <!-- Modal - Create CloudFunction -->
  <modal v-model:show="modalCreateCloudFunctionVisible" :title="$t('computing.cloudFunctions.new')">
    <FormCloudFunctions
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
